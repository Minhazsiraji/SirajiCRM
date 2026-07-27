// Thin server-side fetch helper. Tenant identity is passed via x-tenant-id,
// which matches the API's placeholder auth. Replace both with a Clerk session
// before production — see apps/api/src/common/tenant.decorator.ts.

const API_URL = process.env.API_URL ?? 'http://localhost:3001';
const TENANT_ID = process.env.DEMO_TENANT_ID ?? '';

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'x-tenant-id': TENANT_ID },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`api ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export interface Headline {
  spend: number;
  delivered: number;
  cost_per_delivered_order: number | null;
}

export interface AdRow {
  ad_id: string;
  ad_name: string | null;
  spend: number;
  conversations: number;
  delivered: number;
  returned: number;
  revenue: number;
  cost_per_delivered_order: number | null;
  return_rate: number | null;
  roas_on_delivered: number | null;
}
