import { eq } from 'drizzle-orm';
import { db, withTenant, closeDb } from './client.js';
import { tenants, users, kbEntries } from './schema.js';

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
  });

  console.log('seed complete');
  await closeDb();
}

main().catch(async (err) => {
  console.error(err);
  await closeDb();
  process.exit(1);
});
