import './load-env.js';
import { eq, sql } from 'drizzle-orm';
import { db, withTenant, closeDb } from './client.js';
import { tenants, users, kbEntries, contacts, conversations, orders } from './schema.js';

/**
 * One demo tenant with a knowledge base, so the guardrail has grounded numbers
 * to check against and the inbox has something to show. Idempotent: safe to run
 * repeatedly. This is a shoe-spray seller — the running example throughout.
 */
const DEMO_SLUG = 'demo-shoe-spray';

const KB = [
  {
    key: 'price',
    question: 'What is the price?',
    answer: 'Each bottle is 850 taka. A pack of two is 1500 taka.',
    numericFacts: [850, 1500],
  },
  {
    key: 'delivery_fee',
    question: 'What is the delivery charge?',
    answer: 'Delivery is 60 taka inside Dhaka and 120 taka outside Dhaka. Cash on delivery.',
    numericFacts: [60, 120],
  },
  {
    key: 'delivery_time',
    question: 'How long does delivery take?',
    answer: 'Inside Dhaka 1 to 2 days, outside Dhaka 2 to 4 days.',
    numericFacts: [1, 2, 4],
  },
  {
    key: 'product',
    question: 'What does it do?',
    answer: 'A waterproofing and cleaning spray for leather and canvas shoes. One bottle lasts about 3 months of daily use.',
    numericFacts: [3],
  },
  {
    key: 'cod',
    question: 'Is cash on delivery available?',
    answer: 'Yes, cash on delivery is available everywhere in Bangladesh. Pay the courier when you receive the parcel.',
    numericFacts: [],
  },
];

async function main() {
  let [tenant] = await db().select().from(tenants).where(eq(tenants.slug, DEMO_SLUG));
  if (!tenant) {
    [tenant] = await db()
      .insert(tenants)
      .values({ name: 'Demo Shoe Spray', slug: DEMO_SLUG, botEnabled: true })
      .returning();
    console.log(`created tenant ${tenant.id}`);
  } else {
    console.log(`tenant already exists ${tenant.id}`);
  }

  await withTenant(tenant.id, async (tx) => {
    await tx
      .insert(users)
      .values({
        tenantId: tenant.id,
        externalAuthId: 'seed-owner',
        email: 'owner@demo.local',
        role: 'owner',
      })
      .onConflictDoNothing();

    for (const entry of KB) {
      await tx
        .insert(kbEntries)
        .values({ ...entry, tenantId: tenant.id })
        .onConflictDoUpdate({
          target: [kbEntries.tenantId, kbEntries.key],
          set: { answer: entry.answer, numericFacts: entry.numericFacts, updatedAt: new Date() },
        });
    }

    await seedDemoSales(tx, tenant.id);
  });

  console.log('seed complete');
  console.log(`\nDEMO_TENANT_ID=${tenant.id}`);
  console.log('(the dashboard auto-detects this in dev, so you do not need to set it)\n');
  await closeDb();
}

// Two ad creatives with deliberately different economics, so the dashboard tells
// the story the product exists to tell: the "cheap reach" ad has a far lower cost
// per message but a much higher cost per DELIVERED order and a brutal return rate.
// Idempotent — only runs when this tenant has no orders yet.
const DEMO_ADS = [
  { adId: 'AD_DEMO_RAIN', adName: 'Rainy Season Promo', spend: 1800, delivered: 3, returned: 1 },
  { adId: 'AD_DEMO_CHEAP', adName: 'Cheap Reach Boost', spend: 2000, delivered: 1, returned: 3 },
];

async function seedDemoSales(tx: Awaited<ReturnType<typeof db>>, tenantId: string): Promise<void> {
  const [{ n }] = await tx
    .select({ n: sql<number>`count(*)::int` })
    .from(orders)
    .where(eq(orders.tenantId, tenantId));
  if (n > 0) return; // already seeded

  for (const ad of DEMO_ADS) {
    await tx.execute(sql`
      INSERT INTO ad_spend (tenant_id, ad_id, ad_name, day, spend)
      VALUES (${tenantId}, ${ad.adId}, ${ad.adName}, current_date, ${ad.spend})
      ON CONFLICT (tenant_id, ad_id, day) DO NOTHING
    `);

    const makeOrder = async (state: 'delivered' | 'returned') => {
      const [contact] = await tx
        .insert(contacts)
        .values({ tenantId, name: 'Demo Buyer', district: 'Dhaka', phoneE164: '+8801700000000' })
        .returning({ id: contacts.id });
      const [conv] = await tx
        .insert(conversations)
        .values({ tenantId, contactId: contact.id, channel: 'messenger', adId: ad.adId, state: 'converted' })
        .returning({ id: conversations.id });
      await tx.insert(orders).values({
        tenantId,
        contactId: contact.id,
        conversationId: conv.id,
        variant: 'single',
        qty: 1,
        unitPrice: '850',
        deliveryFee: '60',
        total: '910',
        state,
        deliveredAt: state === 'delivered' ? new Date() : null,
        returnedAt: state === 'returned' ? new Date() : null,
      });
    };

    for (let i = 0; i < ad.delivered; i++) await makeOrder('delivered');
    for (let i = 0; i < ad.returned; i++) await makeOrder('returned');
  }
}

main().catch(async (err) => {
  console.error(err);
  await closeDb();
  process.exit(1);
});
