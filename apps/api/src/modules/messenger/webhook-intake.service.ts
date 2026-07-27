import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db, webhookEvents } from '@orderpilot/db';

/**
 * Meta retries webhooks and can deliver the same event more than once. The
 * webhook_events table has a unique index on (provider, event_id); inserting
 * with ON CONFLICT DO NOTHING and checking whether a row came back is an atomic
 * dedupe that survives concurrent workers. This table is not tenant-scoped — it
 * is the raw intake buffer, deduped before we know which tenant owns the event.
 */
@Injectable()
export class WebhookIntakeService {
  async recordOnce(provider: string, eventId: string, payload: unknown): Promise<boolean> {
    const inserted = await db()
      .insert(webhookEvents)
      .values({ provider, eventId, payload: payload as object })
      .onConflictDoNothing({ target: [webhookEvents.provider, webhookEvents.eventId] })
      .returning({ id: webhookEvents.id });
    return inserted.length > 0;
  }

  async markProcessed(provider: string, eventId: string): Promise<void> {
    await db()
      .update(webhookEvents)
      .set({ processedAt: new Date() })
      .where(sql`${webhookEvents.provider} = ${provider} AND ${webhookEvents.eventId} = ${eventId}`);
  }
}
