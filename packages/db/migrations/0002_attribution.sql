-- Cost per delivered order, by ad creative.
--
-- Meta optimises for cost per message. That metric actively misleads COD
-- sellers: the cheapest creative often attracts impulse orders that get
-- refused at the door. This view replaces it with cash actually collected.
--
-- ad_spend is filled by a nightly job pulling the Marketing Insights API.

CREATE TABLE IF NOT EXISTS ad_spend (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL,
  ad_id         text NOT NULL,
  ad_name       text,
  day           date NOT NULL,
  spend         numeric(12,2) NOT NULL,
  impressions   integer,
  synced_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, ad_id, day)
);

ALTER TABLE ad_spend ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_spend FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON ad_spend
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

CREATE OR REPLACE VIEW ad_performance AS
WITH spend AS (
  SELECT tenant_id, ad_id, max(ad_name) AS ad_name, sum(spend) AS spend
  FROM ad_spend
  GROUP BY tenant_id, ad_id
),
outcomes AS (
  SELECT
    c.tenant_id,
    c.ad_id,
    count(DISTINCT c.id)                                              AS conversations,
    count(o.id) FILTER (WHERE o.state = 'delivered')                  AS delivered,
    count(o.id) FILTER (WHERE o.state = 'returned')                   AS returned,
    coalesce(sum(o.total) FILTER (WHERE o.state = 'delivered'), 0)    AS revenue
  FROM conversations c
  LEFT JOIN orders o ON o.conversation_id = c.id
  WHERE c.ad_id IS NOT NULL
  GROUP BY c.tenant_id, c.ad_id
)
SELECT
  o.tenant_id,
  o.ad_id,
  s.ad_name,
  s.spend,
  o.conversations,
  o.delivered,
  o.returned,
  o.revenue,
  CASE WHEN o.delivered > 0
       THEN round(s.spend / o.delivered, 2) END           AS cost_per_delivered_order,
  CASE WHEN (o.delivered + o.returned) > 0
       THEN round(o.returned::numeric
                  / (o.delivered + o.returned), 3) END    AS return_rate,
  CASE WHEN s.spend > 0
       THEN round(o.revenue / s.spend, 2) END             AS roas_on_delivered
FROM outcomes o
JOIN spend s USING (tenant_id, ad_id)
ORDER BY cost_per_delivered_order NULLS LAST;

-- Return rate by district. Some areas are structurally worse for COD.
-- A seller who requires advance delivery fee for the worst three thanas
-- cuts losses without losing volume.
CREATE OR REPLACE VIEW district_performance AS
SELECT
  o.tenant_id,
  ct.district,
  count(*) FILTER (WHERE o.state = 'delivered') AS delivered,
  count(*) FILTER (WHERE o.state = 'returned')  AS returned,
  round(count(*) FILTER (WHERE o.state = 'returned')::numeric
        / nullif(count(*) FILTER (WHERE o.state IN ('delivered','returned')), 0), 3) AS return_rate
FROM orders o
JOIN contacts ct ON ct.id = o.contact_id
WHERE ct.district IS NOT NULL
GROUP BY o.tenant_id, ct.district
HAVING count(*) FILTER (WHERE o.state IN ('delivered','returned')) >= 10
ORDER BY return_rate DESC;
