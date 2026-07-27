-- Initial tables. This is what `drizzle-kit generate` would emit for schema.ts;
-- it is committed by hand so the repo migrates from a clean database without a
-- generate step. Keep it in sync with packages/db/src/schema.ts.
--
-- Applied FIRST by src/migrate.ts, before 0001_rls.sql and 0002_attribution.sql.

CREATE TYPE "channel"     AS ENUM ('messenger', 'whatsapp');
CREATE TYPE "direction"   AS ENUM ('inbound', 'outbound');
CREATE TYPE "control"     AS ENUM ('bot', 'human');
CREATE TYPE "user_role"   AS ENUM ('owner', 'manager', 'agent', 'viewer');
CREATE TYPE "conv_state"  AS ENUM ('enquiry', 'answering', 'collecting', 'confirming', 'converted', 'abandoned');
CREATE TYPE "order_state" AS ENUM ('draft', 'confirmed', 'booked', 'in_transit', 'delivered', 'returned', 'cancelled');

CREATE TABLE "tenants" (
  "id"                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"                text NOT NULL,
  "slug"                text NOT NULL UNIQUE,
  "fb_page_id"          text,
  "wa_phone_number_id"  text,
  "bot_enabled"         boolean NOT NULL DEFAULT false,
  "auto_send_enabled"   boolean NOT NULL DEFAULT false,
  "created_at"          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "users" (
  "id"                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id"         uuid NOT NULL REFERENCES "tenants"("id"),
  "external_auth_id"  text NOT NULL,
  "email"             text NOT NULL,
  "role"              "user_role" NOT NULL DEFAULT 'agent',
  "created_at"        timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "users_external_auth_idx" ON "users" ("external_auth_id");

CREATE TABLE "kb_entries" (
  "id"            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id"     uuid NOT NULL REFERENCES "tenants"("id"),
  "key"           text NOT NULL,
  "question"      text NOT NULL,
  "answer"        text NOT NULL,
  "numeric_facts" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "updated_at"    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "kb_tenant_key_idx" ON "kb_entries" ("tenant_id", "key");

CREATE TABLE "contacts" (
  "id"                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id"              uuid NOT NULL REFERENCES "tenants"("id"),
  "name"                   text,
  "phone_e164"             text,
  "phone_verified"         boolean NOT NULL DEFAULT false,
  "fb_psid"                text,
  "wa_id"                  text,
  "district"               text,
  "thana"                  text,
  "address_raw"            text,
  "address_json"           jsonb,
  "consent_wa_marketing"   boolean NOT NULL DEFAULT false,
  "consent_at"             timestamptz,
  "blocked"                boolean NOT NULL DEFAULT false,
  "created_at"             timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "contacts_tenant_psid_idx" ON "contacts" ("tenant_id", "fb_psid");
CREATE UNIQUE INDEX "contacts_tenant_waid_idx" ON "contacts" ("tenant_id", "wa_id");
CREATE INDEX "contacts_tenant_phone_idx" ON "contacts" ("tenant_id", "phone_e164");

CREATE TABLE "conversations" (
  "id"                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id"          uuid NOT NULL REFERENCES "tenants"("id"),
  "contact_id"         uuid NOT NULL REFERENCES "contacts"("id"),
  "channel"            "channel" NOT NULL,
  "state"              "conv_state" NOT NULL DEFAULT 'enquiry',
  "control"            "control" NOT NULL DEFAULT 'bot',
  "window_expires_at"  timestamptz,
  "ad_id"              text,
  "ad_ref"             text,
  "entry_point"        text,
  "last_inbound_at"    timestamptz,
  "created_at"         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "conv_tenant_contact_idx" ON "conversations" ("tenant_id", "contact_id");
CREATE INDEX "conv_tenant_ad_idx" ON "conversations" ("tenant_id", "ad_id");

CREATE TABLE "messages" (
  "id"                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id"            uuid NOT NULL REFERENCES "tenants"("id"),
  "conversation_id"      uuid NOT NULL REFERENCES "conversations"("id"),
  "direction"            "direction" NOT NULL,
  "provider_message_id"  text,
  "body"                 text,
  "payload"              jsonb,
  "ai_generated"         boolean NOT NULL DEFAULT false,
  "model"                text,
  "intent"               text,
  "confidence"           numeric(4,3),
  "sources"              jsonb,
  "status"               text NOT NULL DEFAULT 'received',
  "error"                text,
  "created_at"           timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "messages_tenant_provider_idx" ON "messages" ("tenant_id", "provider_message_id");
CREATE INDEX "messages_conv_created_idx" ON "messages" ("conversation_id", "created_at");

CREATE TABLE "orders" (
  "id"               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id"        uuid NOT NULL REFERENCES "tenants"("id"),
  "contact_id"       uuid NOT NULL REFERENCES "contacts"("id"),
  "conversation_id"  uuid REFERENCES "conversations"("id"),
  "variant"          text NOT NULL,
  "qty"              integer NOT NULL DEFAULT 1,
  "unit_price"       numeric(12,2) NOT NULL,
  "delivery_fee"     numeric(12,2) NOT NULL DEFAULT '0',
  "total"            numeric(12,2) NOT NULL,
  "state"            "order_state" NOT NULL DEFAULT 'draft',
  "courier"          text,
  "consignment_id"   text,
  "fraud_score"      numeric(4,3),
  "confirmed_at"     timestamptz,
  "booked_at"        timestamptz,
  "delivered_at"     timestamptz,
  "returned_at"      timestamptz,
  "return_reason"    text,
  "created_at"       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "orders_tenant_state_idx" ON "orders" ("tenant_id", "state");
CREATE INDEX "orders_tenant_contact_idx" ON "orders" ("tenant_id", "contact_id");

CREATE TABLE "webhook_events" (
  "id"           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "provider"     text NOT NULL,
  "event_id"     text NOT NULL,
  "payload"      jsonb NOT NULL,
  "received_at"  timestamptz NOT NULL DEFAULT now(),
  "processed_at" timestamptz
);
CREATE UNIQUE INDEX "webhook_provider_event_idx" ON "webhook_events" ("provider", "event_id");

CREATE TABLE "audit_events" (
  "id"           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id"    uuid NOT NULL,
  "actor"        text NOT NULL,
  "action"       text NOT NULL,
  "entity_type"  text NOT NULL,
  "entity_id"    text,
  "payload"      jsonb,
  "created_at"   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "audit_tenant_created_idx" ON "audit_events" ("tenant_id", "created_at");
