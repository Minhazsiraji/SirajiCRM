import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { GuardrailViolation } from '@orderpilot/shared';
import { ConversationService, type InboundMessage } from './conversation.service.js';
import { OutboundService } from './outbound.service.js';
import { ExtractionService } from '../ai/extraction.service.js';
import { KbService } from '../ai/kb.service.js';

/**
 * The whole point of enqueuing from the webhook is to keep the HTTP handler
 * under Meta's few-second budget. Everything expensive happens here:
 * persistence, extraction, drafting, the guardrail, and the send — each of
 * which can fail independently without losing the inbound message.
 *
 * Auto-send is gated twice: the tenant must have bot_enabled AND
 * auto_send_enabled. With auto-send off, a draft is stored for human approval
 * but never sent. This is the safe default for weeks 3–8 of the rollout.
 */
@Processor('inbound')
export class InboundProcessor extends WorkerHost {
  private readonly log = new Logger(InboundProcessor.name);

  constructor(
    private readonly conversations: ConversationService,
    private readonly outbound: OutboundService,
    private readonly extraction: ExtractionService,
    private readonly kb: KbService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === 'messenger') return this.handleMessage(job.data as InboundMessage);
    if (job.name === 'comment') return this.handleComment(job.data);
    this.log.warn(`Unknown job ${job.name}`);
  }

  private async handleMessage(msg: InboundMessage): Promise<void> {
    const ctx = await this.conversations.ingestInbound(msg);
    if (!ctx) return;

    // A human has taken over this thread — the bot stays silent (Handover).
    if (ctx.control === 'human') return;
    // No text (sticker, image, etc.) — nothing to reason about yet.
    if (!msg.text) return;
    // Bot disabled for this tenant (rollout weeks 3–5: manual inbox only).
    if (!ctx.botEnabled) return;
    if (!process.env.ANTHROPIC_API_KEY) return;

    const history = await this.conversations.history(ctx.tenantId, ctx.conversationId);

    let extraction;
    try {
      extraction = await this.extraction.extract(history);
    } catch (err) {
      this.log.error(`Extraction failed for ${ctx.conversationId}: ${String(err)}`);
      return; // leave for the human inbox; do not guess
    }

    if (extraction.escalate || extraction.intent === 'complaint') {
      await this.conversations.escalate(ctx.tenantId, ctx.conversationId, 'bot', `intent=${extraction.intent}`);
      return;
    }

    const kb = await this.kb.load(ctx.tenantId);
    let draft: { text: string; model: string };
    try {
      draft = await this.extraction.draftReply(history, kb.text, kb.allowedNumbers);
    } catch (err) {
      if (err instanceof GuardrailViolation) {
        // The model tried to state a number that is not in the knowledge base.
        // Never send it — escalate so a human can answer or the KB can be fixed.
        this.log.warn(`Guardrail escalation on ${ctx.conversationId}: ${err.numbers.join(', ')}`);
        await this.conversations.escalate(ctx.tenantId, ctx.conversationId, 'bot', `ungrounded_numbers=${err.numbers.join(',')}`);
        return;
      }
      throw err;
    }

    // Draft stored either way. Only actually sent when auto-send is on.
    if (!ctx.autoSendEnabled) {
      await this.conversations.recordOutbound(ctx.tenantId, ctx.conversationId, {
        body: draft.text,
        providerMessageId: null,
        aiGenerated: true,
        model: draft.model,
        intent: extraction.intent,
        confidence: extraction.confidence,
        status: 'draft',
      });
      return;
    }

    if (!ctx.pageAccessToken) {
      this.log.error('FB_PAGE_ACCESS_TOKEN missing; cannot auto-send');
      return;
    }

    try {
      const sent = await this.outbound.send({
        conversationId: ctx.conversationId,
        psid: msg.psid,
        pageAccessToken: ctx.pageAccessToken,
        text: draft.text,
        windowExpiresAt: ctx.windowExpiresAt,
      });
      await this.conversations.recordOutbound(ctx.tenantId, ctx.conversationId, {
        body: draft.text,
        providerMessageId: sent.messageId,
        aiGenerated: true,
        model: draft.model,
        intent: extraction.intent,
        confidence: extraction.confidence,
        status: 'sent',
      });
    } catch (err) {
      await this.conversations.recordOutbound(ctx.tenantId, ctx.conversationId, {
        body: draft.text,
        providerMessageId: null,
        aiGenerated: true,
        model: draft.model,
        intent: extraction.intent,
        status: 'failed',
        error: String(err),
      });
      throw err; // let BullMQ retry
    }
  }

  private async handleComment(data: {
    pageId: string;
    commentId: string;
    text: string;
  }): Promise<void> {
    // Comment-to-private-reply is the growth mechanic: exactly one private reply
    // is permitted per comment and it opens the 24-hour window. The actual Graph
    // call lives in OutboundService.privateReply; here we only decide to do it.
    // Wire the tenant lookup + a canned/AI opener once App Review passes.
    this.log.log(`Comment ${data.commentId} on page ${data.pageId}: "${data.text.slice(0, 60)}"`);
  }
}
