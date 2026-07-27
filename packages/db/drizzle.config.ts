import { defineConfig } from 'drizzle-kit';

// Migrations are applied by src/migrate.ts, which runs the drizzle-generated
// table migration first, then the hand-written RLS and attribution migrations
// in filename order. `drizzle-kit generate` only ever emits table DDL.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './migrations',
  dbCredentials: {
    // The generator/migrator uses the owner role; the app connects as
    // orderpilot_app, which is subject to FORCE ROW LEVEL SECURITY.
    url: process.env.DATABASE_MIGRATION_URL ?? 'postgres://postgres:postgres@localhost:5432/orderpilot',
  },
});
