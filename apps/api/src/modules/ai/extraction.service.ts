import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { Extraction, findUngroundedNumbers, GuardrailViolation } from '@orderpilot/shared';

const EXTRACTION_TOOL = {
  name: 'record_extraction',
  description: 'Record what the customer said and what order details are still missing.',
  input_schema: {
    type: 'object' as const,
    properties: {
      intent: {
        type: 'string',
        enum: ['price', 'delivery', 'cod', 'product_question', 'order', 'chitchat', 'complaint', 'other'],
      },
      language: { type: 'string', enum: ['bn', 'en', 'banglish', 'mixed'] },
      extracted: {
        type: 'object',
        properties: {
          name: { type: ['string', 'null'] },
          phone: { type: ['string', 'null'] },
          address_raw: { type: ['string', 'null'] },
          district: { type: ['string', 'null'] },
          thana: { type: ['string', 'null'] },
          qty: { type: ['integer', 'null'] },
          variant: { type: ['string', 'null'] },
        },
        required: ['name', 'phone', 'address_raw', 'district', 'thana', 'qty', 'variant'],
      },
      missing: { type: 'array', items: { type: 'string' } },
      confidence: { type: 'number' },
      escalate: { type: 'boolean' },
    },
    required: ['intent', 'language', 'extracted', 'missing', 'confidence', 'escalate'],
  },
};

const EXTRACTION_SYSTEM = `You read customer messages sent to a Bangladeshi online seller.
Messages arrive in Bangla script, romanised Banglish, English, or a mix of all three.

Extract only what the customer actually stated. Never guess a district from a
neighbourhood you are unsure about — leave it null and add it to "missing".

Set escalate to true for complaints, refund demands, abusive language, or any
message you are not confident you understood.

Call record_extraction exactly once.`;

@Injectable()
export class ExtractionService {
  private readonly log = new Logger(ExtractionService.name);
  private _client: Anthropic | null = null;

  // Lazy: the app must boot for manual-inbox mode (rollout weeks 3–5) with no
  // ANTHROPIC_API_KEY set. The client is only constructed on first AI call, and
  // callers already gate on the key being present.
  private get client(): Anthropic {
    if (!this._client) this._client = new Anthropic();
    return this._client;
  }

  async extract(history: { role: 'user' | 'assistant'; content: string }[]): Promise<Extraction> {
    const res = await this.client.messages.create({
      model: process.env.EXTRACTION_MODEL ?? 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: EXTRACTION_SYSTEM,
      tools: [EXTRACTION_TOOL],
      tool_choice: { type: 'tool', name: 'record_extraction' },
      messages: history,
    });

    const block = res.content.find((b) => b.type === 'tool_use');
    if (!block || block.type !== 'tool_use') {
      throw new Error('extraction_no_tool_use');
    }
    return Extraction.parse(block.input);
  }

  /**
   * Draft a reply grounded in the knowledge base.
   *
   * `allowedNumbers` is every number the bot is permitted to state: prices,
   * delivery fees, delivery days, pack sizes. If the draft contains any other
   * number, we do not send it — we escalate. This is what stops the bot
   * inventing a discount the seller never offered.
   */
  async draftReply(
    history: { role: 'user' | 'assistant'; content: string }[],
    knowledgeBase: string,
    allowedNumbers: number[],
  ): Promise<{ text: string; model: string }> {
    const res = await this.client.messages.create({
      model: process.env.REPLY_MODEL ?? 'claude-sonnet-5',
      max_tokens: 512,
      system: `You reply to customers for a small online seller. Be brief, warm, and
concrete. Match the customer's language — if they write Banglish, reply in Banglish.

You may only state facts from the knowledge base below. If you do not know
something, say you will check and stop. Never invent a price, discount,
delivery time, or stock level.

KNOWLEDGE BASE
${knowledgeBase}`,
      messages: history,
    });

    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    const ungrounded = findUngroundedNumbers(text, allowedNumbers);
    if (ungrounded.length > 0) {
      this.log.warn(`Guardrail blocked draft containing ${ungrounded.join(', ')}`);
      throw new GuardrailViolation(ungrounded);
    }

    return { text, model: res.model };
  }
}
