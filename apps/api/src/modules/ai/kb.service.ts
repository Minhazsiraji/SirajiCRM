import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { withTenant, kbEntries, type Database } from '@orderpilot/db';

export interface KnowledgeBase {
  text: string;
  allowedNumbers: number[];
}

/**
 * The knowledge base is the only thing the bot is allowed to assert. `text`
 * goes into the reply prompt; `allowedNumbers` is the whitelist the numeric
 * guardrail checks every draft against. If a price is not here, the bot cannot
 * say it — which is the entire point.
 */
@Injectable()
export class KbService {
  async load(tenantId: string): Promise<KnowledgeBase> {
    return withTenant(tenantId, async (tx: Database) => {
      const rows = await tx
        .select()
        .from(kbEntries)
        .where(eq(kbEntries.tenantId, tenantId));

      const text = rows
        .map((r) => `Q: ${r.question}\nA: ${r.answer}`)
        .join('\n\n');

      const allowedNumbers = [
        ...new Set(rows.flatMap((r) => (r.numericFacts ?? []) as number[])),
      ];

      return { text, allowedNumbers };
    });
  }
}
