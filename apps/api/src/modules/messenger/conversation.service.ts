import { Injectable, Logger } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import {
  db, withTenant, tenants, contacts, conversations, messages, auditEvents,
  type Database,
} from '@orderpilot/db';

const WINDOW_MS = 24 * 60 * 60 * 1000;

export interface InboundMessage {
  pageId: string;
  psid: string;
  text: string | null;
  mid: string | null;
  timestamp: number;
  adId: string | null;
  adRef: string | null;
  entryPoint: string | null;
}

export interface ConversationContext {
  tenantId: string;
  botEnabled: boolean;
  autoSendEnabled: boolean;
  contactId: string;
  conversationId: string;
  control: 'bot' | 'human';
  windowExpiresAt: Date | null;
  pageAccessToken: string | null;
}

@Injectable()
export class ConversationService {
  private readonly log = new Logger(ConversationService.name);

  /** Resolve the tenant that owns a Facebook Page. Not tenant-scoped. */
  async tenantByPage(pageId: string) {
    const [t] = await db().select().from(tenants).where(eq(tenants.fbPageId, pageId));
    return t ?? null;
  }

  /**
   * Upsert the contact and its open conversation, record the inbound message,
   * and refresh the 24-hour window. Everything here runs inside the tenant's
   * RLS context. Returns the context the worker needs to decide whether and how
   * to reply.
   */
  async ingestInbound(msg: InboundMessage): Promise<ConversationContext | null> {
    const tenant = await this.tenantByPage(msg.pageId);
    if (!tenant) {
      this.log.warn(`No tenant for page ${msg.pageId}; dropping message`);
      return null;
    }

    return withTenant(tenant.id, async (tx: Database) => {
      const contactId = await this.upsertContact(tx, tenant.id, msg.psid);
      const conv = await this.openConversation(tx, tenant.id, contactId, msg);

      const windowExpiresAt = new Date(Date.now() + WINDOW_MS);
      await tx
        .update(conversations)
        .set({ windowExpiresAt, lastInboundAt: new Date(), state: 'answering' })
        .where(eq(conversations.id, conv.id));

      if (msg.mid || msg.text) {
        await tx
          .insert(messages)
          .values({
            tenantId: tenant.id,
            conversationId: conv.id,
            direction: 'inbound',
            providerMessageId: msg.mid,
            body: msg.text,
            status: 'received',
          })
          .onConflictDoNothing({ target: [messages.tenantId, messages.providerMessageId] });
      }

      return {
        tenantId: tenant.id,
        botEnabled: tenant.botEnabled,
        autoSendEnabled: tenant.autoSendEnabled,
        contactId,
        conversationId: conv.id,
        control: conv.control,
        windowExpiresAt,
        pageAccessToken: process.env.FB_PAGE_ACCESS_TOKEN ?? null,
      };
    });
  }

  private async upsertContact(tx: Database, tenantId: string, psid: string): Promise<string> {
    const [existing] = await tx
      .select({ id: contacts.id })
      .from(contacts)
      .where(and(eq(contacts.tenantId, tenantId), eq(contacts.fbPsid, psid)));
    if (existing) return existing.id;

    const [created] = await tx
      .insert(contacts)
      .values({ tenantId, fbPsid: psid })
      .onConflictDoNothing({ target: [contacts.tenantId, contacts.fbPsid] })
      .returning({ id: contacts.id });
    if (created) return created.id;

    // Lost a race with a concurrent insert — re-read.
    const [again] = await tx
      .select({ id: contacts.id })
      .from(contacts)
      .where(and(eq(contacts.tenantId, tenantId), eq(contacts.fbPsid, psid)));
    return again.id;
  }

  private async openConversation(
    tx: Database,
    tenantId: string,
    contactId: string,
    msg: InboundMessage,
  ) {
    const [open] = await tx
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.tenantId, tenantId),
          eq(conversations.contactId, contactId),
          eq(conversations.channel, 'messenger'),
          sql`${conversations.state} NOT IN ('converted', 'abandoned')`,
        ),
      )
      .orderBy(desc(conversations.createdAt))
      .limit(1);
    if (open) return open;

    const [created] = await tx
      .insert(conversations)
      .values({
        tenantId,
        contactId,
        channel: 'messenger',
        // Attribution is set once, on the conversation that started from the ad.
        adId: msg.adId,
        adRef: msg.adRef,
        entryPoint: msg.entryPoint,
      })
      .returning();
    return created;
  }

  /** Persist an outbound message and, when it succeeded, keep the audit trail. */
  async recordOutbound(
    tenantId: string,
    conversationId: string,
    data: {
      body: string;
      providerMessageId: string | null;
      aiGenerated: boolean;
      model?: string;
      intent?: string;
      confidence?: number;
      sources?: string[];
      status: string;
      error?: string;
    },
  ): Promise<void> {
    await withTenant(tenantId, async (tx: Database) => {
      await tx.insert(messages).values({
        tenantId,
        conversationId,
        direction: 'outbound',
        body: data.body,
        providerMessageId: data.providerMessageId,
        aiGenerated: data.aiGenerated,
        model: data.model,
        intent: data.intent,
        confidence: data.confidence?.toFixed(3),
        sources: data.sources,
        status: data.status,
        error: data.error,
      });
    });
  }

  /** Hand the thread to a human and stop the bot replying on it. */
  async escalate(tenantId: string, conversationId: string, actor: string, reason: string): Promise<void> {
    await withTenant(tenantId, async (tx: Database) => {
      await tx
        .update(conversations)
        .set({ control: 'human' })
        .where(eq(conversations.id, conversationId));
      await tx.insert(auditEvents).values({
        tenantId,
        actor,
        action: 'escalate',
        entityType: 'conversation',
        entityId: conversationId,
        payload: { reason },
      });
    });
  }

  /** Recent turns for the AI, oldest first, mapped to the model's role shape. */
  async history(
    tenantId: string,
    conversationId: string,
    limit = 12,
  ): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
    return withTenant(tenantId, async (tx: Database) => {
      const rows = await tx
        .select({ direction: messages.direction, body: messages.body })
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(desc(messages.createdAt))
        .limit(limit);
      return rows
        .reverse()
        .filter((r) => r.body && r.body.trim().length > 0)
        .map((r) => ({
          role: r.direction === 'inbound' ? ('user' as const) : ('assistant' as const),
          content: r.body as string,
        }));
    });
  }

  async recordConsent(tenantId: string, contactId: string): Promise<void> {
    await withTenant(tenantId, async (tx: Database) => {
      await tx
        .update(contacts)
        .set({ consentWaMarketing: true, consentAt: new Date() })
        .where(eq(contacts.id, contactId));
    });
  }
}
