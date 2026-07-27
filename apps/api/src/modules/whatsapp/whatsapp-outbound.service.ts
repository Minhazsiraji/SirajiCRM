import { Injectable, Logger } from '@nestjs/common';

/**
 * WhatsApp Cloud API outbound. Two modes, and the distinction is a compliance
 * boundary, not a convenience:
 *
 *   - Inside the 24-hour service window (customer messaged in the last 24h):
 *     free-form session messages are allowed.
 *   - Outside it: ONLY a pre-approved template, and marketing templates require
 *     the customer to have opted in (contacts.consent_wa_marketing). This is the
 *     ONLY compliant way to send a reorder nudge — never on Messenger.
 *
 * See docs/meta-constraints.md.
 */
@Injectable()
export class WhatsappOutboundService {
  private readonly log = new Logger(WhatsappOutboundService.name);

  private endpoint(): { url: string; token: string } {
    const phoneId = process.env.WA_PHONE_NUMBER_ID;
    const token = process.env.WA_ACCESS_TOKEN;
    const version = process.env.META_GRAPH_VERSION ?? 'v21.0';
    if (!phoneId || !token) throw new Error('WhatsApp not configured (WA_PHONE_NUMBER_ID / WA_ACCESS_TOKEN)');
    return { url: `https://graph.facebook.com/${version}/${phoneId}/messages`, token };
  }

  async sendSession(waId: string, text: string): Promise<{ messageId: string }> {
    return this.post({
      messaging_product: 'whatsapp',
      to: waId,
      type: 'text',
      text: { body: text },
    });
  }

  /**
   * `variables` fill the template's {{1}}, {{2}} … in order.
   * The template + language must already be APPROVED in the WABA.
   */
  async sendTemplate(
    waId: string,
    templateName: string,
    languageCode: string,
    variables: string[] = [],
  ): Promise<{ messageId: string }> {
    const components =
      variables.length > 0
        ? [{ type: 'body', parameters: variables.map((v) => ({ type: 'text', text: v })) }]
        : [];
    return this.post({
      messaging_product: 'whatsapp',
      to: waId,
      type: 'template',
      template: { name: templateName, language: { code: languageCode }, components },
    });
  }

  private async post(body: object): Promise<{ messageId: string }> {
    const { url, token } = this.endpoint();
    const res = await fetch(url, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text();
      this.log.error(`WhatsApp send failed: ${res.status} ${detail}`);
      throw new Error(`whatsapp_send_failed_${res.status}`);
    }
    const json = (await res.json()) as { messages?: { id: string }[] };
    return { messageId: json.messages?.[0]?.id ?? '' };
  }
}
