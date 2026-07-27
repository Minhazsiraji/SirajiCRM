import {
  pgTable, pgEnum, uuid, text, timestamp, integer, numeric,
  boolean, jsonb, index, uniqueIndex,
} from 'drizzle-orm/pg-core';

export const channel = pgEnum('channel', ['messenger', 'whatsapp']);
export const direction = pgEnum('direction', ['inbound', 'outbound']);
export const control = pgEnum('control', ['bot', 'human']);
export const userRole = pgEnum('user_role', ['owner', 'manager', 'agent', 'viewer']);

export const convState = pgEnum('conv_state', [
  'enquiry', 'answering', 'collecting', 'confirming', 'converted', 'abandoned',
]);

export const orderState = pgEnum('order_state', [
  'draft', 'confirmed', 'booked', 'in_transit', 'delivered', 'returned', 'cancelled',
]);

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  fbPageId: text('fb_page_id'),
  waPhoneNumberId: text('wa_phone_number_id'),
  botEnabled: boolean('bot_enabled').notNull().default(false),
  autoSendEnabled: boolean('auto_send_enabled').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  externalAuthId: text('external_auth_id').notNull(),
  email: text('email').notNull(),
  role: userRole('role').notNull().default('agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  byAuth: uniqueIndex('users_external_auth_idx').on(t.externalAuthId),
}));

// Everything the bot is allowed to assert. If it is not here, the bot cannot say it.
export const kbEntries = pgTable('kb_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  key: text('key').notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  numericFacts: jsonb('numeric_facts').$type<number[]>().notNull().default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  byKey: uniqueIndex('kb_tenant_key_idx').on(t.tenantId, t.key),
}));

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  name: text('name'),
  phoneE164: text('phone_e164'),
  phoneVerified: boolean('phone_verified').notNull().default(false),
  fbPsid: text('fb_psid'),
  waId: text('wa_id'),
  district: text('district'),
  thana: text('thana'),
  addressRaw: text('address_raw'),
  addressJson: jsonb('address_json'),
  consentWaMarketing: boolean('consent_wa_marketing').notNull().default(false),
  consentAt: timestamp('consent_at', { withTimezone: true }),
  blocked: boolean('blocked').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  byPsid: uniqueIndex('contacts_tenant_psid_idx').on(t.tenantId, t.fbPsid),
  byWaId: uniqueIndex('contacts_tenant_waid_idx').on(t.tenantId, t.waId),
  byPhone: index('contacts_tenant_phone_idx').on(t.tenantId, t.phoneE164),
}));

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  contactId: uuid('contact_id').notNull().references(() => contacts.id),
  channel: channel('channel').notNull(),
  state: convState('state').notNull().default('enquiry'),
  control: control('control').notNull().default('bot'),
  // Read this before EVERY outbound send. Expired + no valid tag = do not send.
  windowExpiresAt: timestamp('window_expires_at', { withTimezone: true }),
  // Attribution: from the Messenger referral payload. This is how you get
  // cost per delivered order per ad creative.
  adId: text('ad_id'),
  adRef: text('ad_ref'),
  entryPoint: text('entry_point'),
  lastInboundAt: timestamp('last_inbound_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  byContact: index('conv_tenant_contact_idx').on(t.tenantId, t.contactId),
  byAd: index('conv_tenant_ad_idx').on(t.tenantId, t.adId),
}));

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id),
  direction: direction('direction').notNull(),
  providerMessageId: text('provider_message_id'),
  body: text('body'),
  payload: jsonb('payload'),
  aiGenerated: boolean('ai_generated').notNull().default(false),
  model: text('model'),
  intent: text('intent'),
  confidence: numeric('confidence', { precision: 4, scale: 3 }),
  sources: jsonb('sources').$type<string[]>(),
  status: text('status').notNull().default('received'),
  error: text('error'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  byProviderId: uniqueIndex('messages_tenant_provider_idx').on(t.tenantId, t.providerMessageId),
  byConv: index('messages_conv_created_idx').on(t.conversationId, t.createdAt),
}));

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  contactId: uuid('contact_id').notNull().references(() => contacts.id),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  variant: text('variant').notNull(),
  qty: integer('qty').notNull().default(1),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  deliveryFee: numeric('delivery_fee', { precision: 12, scale: 2 }).notNull().default('0'),
  total: numeric('total', { precision: 12, scale: 2 }).notNull(),
  state: orderState('state').notNull().default('draft'),
  courier: text('courier'),
  consignmentId: text('consignment_id'),
  fraudScore: numeric('fraud_score', { precision: 4, scale: 3 }),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
  bookedAt: timestamp('booked_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  returnedAt: timestamp('returned_at', { withTimezone: true }),
  returnReason: text('return_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  byState: index('orders_tenant_state_idx').on(t.tenantId, t.state),
  byContact: index('orders_tenant_contact_idx').on(t.tenantId, t.contactId),
}));

// Meta retries webhooks. Insert here first; a conflict means already handled.
export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  provider: text('provider').notNull(),
  eventId: text('event_id').notNull(),
  payload: jsonb('payload').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
}, (t) => ({
  byEvent: uniqueIndex('webhook_provider_event_idx').on(t.provider, t.eventId),
}));

// Append only. No update path anywhere in the codebase.
export const auditEvents = pgTable('audit_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  payload: jsonb('payload'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  byTenant: index('audit_tenant_created_idx').on(t.tenantId, t.createdAt),
}));
