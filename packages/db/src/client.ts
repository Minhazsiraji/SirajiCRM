import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import * as schema from './schema.js';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

let sqlClient: postgres.Sql | null = null;
let dbInstance: Database | null = null;

function connectionUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return url;
}

/**
 * The raw drizzle handle. Do NOT run tenant-scoped queries directly on this —
 * outside a tenant context RLS returns zero rows, and inserts are rejected by
 * the WITH CHECK clause. Use `withTenant` instead. This is exported only for
 * migrations, the webhook intake buffer, and health checks.
 */
export function db(): Database {
  if (!dbInstance) {
    sqlClient = postgres(connectionUrl(), { max: 10 });
    dbInstance = drizzle(sqlClient, { schema });
  }
  return dbInstance;
}

/**
 * Run `fn` inside a transaction with `app.tenant_id` set, so every query is
 * constrained to a single tenant by row level security. A stray query that
 * forgets its WHERE clause returns nothing instead of another seller's data.
 *
 * `set_config(..., true)` scopes the setting to the transaction, so it never
 * leaks to the next request that reuses the pooled connection.
 */
export async function withTenant<T>(
  tenantId: string,
  fn: (tx: Database) => Promise<T>,
): Promise<T> {
  return db().transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.tenant_id', ${tenantId}, true)`);
    return fn(tx as unknown as Database);
  });
}

export async function closeDb(): Promise<void> {
  if (sqlClient) {
    await sqlClient.end();
    sqlClient = null;
    dbInstance = null;
  }
}

export { schema };
export * from './schema.js';
