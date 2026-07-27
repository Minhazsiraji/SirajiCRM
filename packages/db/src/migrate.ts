import './load-env.js';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import postgres from 'postgres';

/**
 * Applies every .sql file in ./migrations in filename order, once, tracked in
 * a _migrations table. Order matters:
 *   0000_init         creates tables
 *   0001_rls          creates the app role and forces row level security
 *   0002_attribution  adds ad_spend and the reporting views
 *
 * Runs as the OWNER role (DATABASE_MIGRATION_URL), because creating roles and
 * altering table security requires ownership. The application never uses this
 * connection string — it connects as orderpilot_app, which RLS applies to.
 */
async function main() {
  const url =
    process.env.DATABASE_MIGRATION_URL ??
    'postgres://postgres:postgres@localhost:5432/orderpilot';
  const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

  const sql = postgres(url, { max: 1 });
  try {
    await sql`CREATE TABLE IF NOT EXISTS _migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`;

    const applied = new Set(
      (await sql`SELECT name FROM _migrations`).map((r) => r.name as string),
    );

    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`skip  ${file}`);
        continue;
      }
      const ddl = readFileSync(join(migrationsDir, file), 'utf8');
      console.log(`apply ${file}`);
      await sql.begin(async (tx) => {
        await tx.unsafe(ddl);
        await tx`INSERT INTO _migrations (name) VALUES (${file})`;
      });
    }

    console.log('migrations complete');
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
