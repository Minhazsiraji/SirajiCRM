import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { withTenant, type Database } from '@orderpilot/db';

/**
 * The reporting views (ad_performance, district_performance) are defined in
 * migration 0002. They run under the same RLS context as everything else, so a
 * query here only ever sees the current tenant's rows.
 */
@Injectable()
export class ReportingService {
  async adPerformance(tenantId: string): Promise<Record<string, unknown>[]> {
    return withTenant(tenantId, async (tx: Database) => {
      const rows = await tx.execute(sql`
        SELECT ad_id, ad_name, spend, conversations, delivered, returned, revenue,
               cost_per_delivered_order, return_rate, roas_on_delivered
        FROM ad_performance
        ORDER BY cost_per_delivered_order NULLS LAST
      `);
      return rows as unknown as Record<string, unknown>[];
    });
  }

  async districtPerformance(tenantId: string): Promise<Record<string, unknown>[]> {
    return withTenant(tenantId, async (tx: Database) => {
      const rows = await tx.execute(sql`
        SELECT district, delivered, returned, return_rate
        FROM district_performance
        ORDER BY return_rate DESC
      `);
      return rows as unknown as Record<string, unknown>[];
    });
  }

  /** The single headline number: cost per delivered order across all ads. */
  async headline(tenantId: string): Promise<{ spend: number; delivered: number; cost_per_delivered_order: number | null }> {
    return withTenant(tenantId, async (tx: Database) => {
      const [row] = (await tx.execute(sql`
        WITH s AS (SELECT coalesce(sum(spend), 0) AS spend FROM ad_spend),
             d AS (SELECT count(*) AS delivered FROM orders WHERE state = 'delivered')
        SELECT s.spend,
               d.delivered,
               CASE WHEN d.delivered > 0 THEN round(s.spend / d.delivered, 2) END AS cost_per_delivered_order
        FROM s, d
      `)) as unknown as { spend: number; delivered: number; cost_per_delivered_order: number | null }[];
      return row ?? { spend: 0, delivered: 0, cost_per_delivered_order: null };
    });
  }
}
