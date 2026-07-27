import { Injectable, Logger } from '@nestjs/common';

/**
 * Message tags permitted outside the 24-hour window. This list is short on
 * purpose — these are the only ones Meta allows for a commerce use case.
 *
 * NOT on this list, and not permitted by any tag:
 *   - "still interested?" follow-ups
 *   - "we have stock" nudges
 *   - reorder reminders
 *   - anything promotional
 *
 * Those must go over WhatsApp with an approved marketing template, after the
 * customer opted in during the live conversation. Attempting them on Messenger
 * gets your app restricted.
 */
export const ALLOWED_TAGS = ['POST_PURCHASE_UPDATE', 'CONFIRMED_EVENT_UPDATE', 'ACCOUNT_UPDATE'] as const;
export type MessageTag = (typeof ALLOWED_TAGS)[number];

export class WindowClosedError extends Error {
  constructor(conversationId: string) {
    super(`Messaging window closed for conversation ${conversationId} and no valid tag supplied`);
  }
}

interface SendInput {
  conversationId: string;
  psid: string;
  pageAccessToken: string;
  text: string;
  windowExpiresAt: Date | null;
  tag?: MessageTag;
}

@Injectable()
export class OutboundService {
  private readonly log = new Logger(OutboundService.name);

  async send(input: SendInput): Promise<{ messageId: string }> {
    const open = input.windowExpiresAt !== null && input.windowExpiresAt > new Date();

    if (!open && !input.tag) {
      // Fail loudly. A silent drop here means the seller believes a customer
      // was contacted when they were not.
      throw new WindowClosedError(input.conversationId);
    }

    const body: Record<string, unknown> = {
      recipient: { id: input.psid },
      message: { text: input.text },
      messaging_type: open ? 'RESPONSE' : 'MESSAGE_TAG',
    };
    if (!open && input.tag) body.tag = input.tag;

    const res = await fetch(
      `https://graph.facebook.com/v21.0/me/messages?access_token=${input.pageAccessToken}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      this.log.error(`Send failed for ${input.conversationId}: ${res.status} ${detail}`);
      throw new Error(`messenger_send_failed_${res.status}`);
    }

    const json = (await res.json()) as { message_id: string };
    return { messageId: json.message_id };
  }

  /**
   * The one private reply permitted per public comment. It opens the 24-hour
   * window, so the bot can then have a normal conversation. Do NOT loop this —
   * Meta allows a single private reply per comment id.
   */
  async privateReply(input: {
    commentId: string;
    pageAccessToken: string;
    text: string;
  }): Promise<{ messageId: string }> {
    const version = process.env.META_GRAPH_VERSION ?? 'v21.0';
    const res = await fetch(
      `https://graph.facebook.com/${version}/me/messages?access_token=${input.pageAccessToken}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          recipient: { comment_id: input.commentId },
          message: { text: input.text },
        }),
      },
    );
    if (!res.ok) {
      const detail = await res.text();
      this.log.error(`Private reply failed for comment ${input.commentId}: ${res.status} ${detail}`);
      throw new Error(`private_reply_failed_${res.status}`);
    }
    const json = (await res.json()) as { message_id: string };
    return { messageId: json.message_id };
  }
}
