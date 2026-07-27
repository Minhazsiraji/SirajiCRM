import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { eq } from 'drizzle-orm';
import { db, withTenant, closeDb } from '../client.js';
import { tenants, contacts } from '../schema.js';

/**
 * Cross-tenant isolation. If any assertion here fails, one seller can read or
 * write another seller's customers — do not merge. CI runs this as the
 * `tenant-isolation` job on every PR, connecting as the orderpilot_app role
 * (not the owner), which is subject to FORCE ROW LEVEL SECURITY.
 */
describe('tenant isolation (RLS)', () => {
  let tenantA: string;
  let tenantB: string;
  const suffix = Date.now().toString(36);

  beforeAll(async () => {
    // tenants is intentionally NOT tenant-scoped, so it can be created without
    // a context. Everything referencing it IS scoped.
    const [a] = await db().insert(tenants).values({ name: 'A', slug: `a-${suffix}` }).returning();
    const [b] = await db().insert(tenants).values({ name: 'B', slug: `b-${suffix}` }).returning();
    tenantA = a.id;
    tenantB = b.id;

    await withTenant(tenantA, (tx) =>
      tx.insert(contacts).values({ tenantId: tenantA, name: 'Alice', fbPsid: `psid-a-${suffix}` }),
    );
    await withTenant(tenantB, (tx) =>
      tx.insert(contacts).values({ tenantId: tenantB, name: 'Bob', fbPsid: `psid-b-${suffix}` }),
    );
  });

  afterAll(async () => {
    // Clean up under each tenant's own context.
    await withTenant(tenantA, (tx) => tx.delete(contacts).where(eq(contacts.tenantId, tenantA)));
    await withTenant(tenantB, (tx) => tx.delete(contacts).where(eq(contacts.tenantId, tenantB)));
    await db().delete(tenants).where(eq(tenants.id, tenantA));
    await db().delete(tenants).where(eq(tenants.id, tenantB));
    await closeDb();
  });

  it('a tenant sees only its own contacts', async () => {
    const rowsA = await withTenant(tenantA, (tx) => tx.select().from(contacts));
    expect(rowsA).toHaveLength(1);
    expect(rowsA[0].name).toBe('Alice');

    const rowsB = await withTenant(tenantB, (tx) => tx.select().from(contacts));
    expect(rowsB).toHaveLength(1);
    expect(rowsB[0].name).toBe('Bob');
  });

  it('a query without a tenant context returns zero rows', async () => {
    const rows = await db().select().from(contacts);
    expect(rows).toHaveLength(0);
  });

  it('a tenant cannot insert a row belonging to another tenant', async () => {
    await expect(
      withTenant(tenantA, (tx) =>
        tx.insert(contacts).values({ tenantId: tenantB, name: 'Smuggled', fbPsid: `x-${suffix}` }),
      ),
    ).rejects.toThrow();
  });

  it('a tenant cannot read another tenant by spoofing a WHERE clause', async () => {
    const rows = await withTenant(tenantA, (tx) =>
      tx.select().from(contacts).where(eq(contacts.tenantId, tenantB)),
    );
    expect(rows).toHaveLength(0);
  });
});
