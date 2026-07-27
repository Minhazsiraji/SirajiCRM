// Thin server-side fetch helper. Tenant identity is passed via x-tenant-id,
// which matches the API's placeholder auth. Replace both with a Clerk session
// before production — see apps/api/src/common/tenant.decorator.ts.

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

// In local dev, if DEMO_TENANT_ID isn't set we ask the API for the seeded demo
// tenant so the dashboard renders with zero manual config. In production the
// tenant comes from the signed-in session, not this fallback.
let cachedTenant: string | null = null;
async function tenantId(): Promise<string> {
  if (process.env.DEMO_TENANT_ID) return process.env.DEMO_TENANT_ID;
  if (cachedTenant) return cachedTenant;
  try {
    const res = await fetch(`${API_URL}/dev/demo-tenant`, { cache: 'no-store' });
    if (res.ok) {
      const json = (await res.json()) as { id: string | null };
      cachedTenant = json.id;
      return json.id ?? '';
    }
  } catch {
    /* API not up yet — fall through to empty, the page renders its empty state */
  }
  return '';
}

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'x-tenant-id': await tenantId() },
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
