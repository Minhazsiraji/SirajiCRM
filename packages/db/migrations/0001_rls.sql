-- Tenant isolation. Run AFTER the drizzle-generated table migration.
--
-- Why this exists: a missing WHERE tenant_id = ... in one query leaks another
-- seller's entire customer list. Application-level filtering is one typo away
-- from a breach. This makes the database refuse.

-- 1. Application role. The migration role owns the tables; the app role does not,
--    because table owners bypass RLS unless FORCE is set. We set FORCE anyway.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'orderpilot_app') THEN
    CREATE ROLE orderpilot_app LOGIN PASSWORD 'change_me_in_deploy';
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO orderpilot_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO orderpilot_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO orderpilot_app;

-- 2. Enable + force RLS on every tenant-scoped table.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users','kb_entries','contacts','conversations',
    'messages','orders','audit_events'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I', t);
    -- NULLIF(..., '') is load-bearing: after a transaction-local set_config,
    -- an undefined custom GUC resets to '' (not NULL), and ''::uuid throws.
    -- Without this, a query outside a tenant context errors instead of safely
    -- returning zero rows. NULLIF turns '' into NULL, so the comparison yields
    -- no rows — fail-closed and quiet.
    EXECUTE format($f$
      CREATE POLICY tenant_isolation ON %I
        USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
        WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    $f$, t);
  END LOOP;
END
$$;

-- 3. audit_events is append only. Revoke the ability to rewrite history.
REVOKE UPDATE, DELETE ON audit_events FROM orderpilot_app;

-- 4. webhook_events is not tenant-scoped (it is the raw intake buffer, deduped
--    before we know which tenant it belongs to). It holds no customer data
--    beyond what arrives from Meta and is purged on a retention job.

-- Usage: every request must open a transaction and run
--   SELECT set_config('app.tenant_id', $1, true);
-- before any query. See apps/api/src/common/tenant.middleware.ts
