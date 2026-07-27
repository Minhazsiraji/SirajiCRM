import { z } from 'zod';

// ---------------------------------------------------------------------------
// Extraction contract. Every inbound message produces exactly this shape.
// The bot asks only for what lands in `missing`.
// ---------------------------------------------------------------------------

export const Intent = z.enum([
  'price', 'delivery', 'cod', 'product_question',
  'order', 'chitchat', 'complaint', 'other',
]);

export const Extraction = z.object({
  intent: Intent,
  language: z.enum(['bn', 'en', 'banglish', 'mixed']),
  extracted: z.object({
    name: z.string().nullable(),
    phone: z.string().nullable(),
    address_raw: z.string().nullable(),
    district: z.string().nullable(),
    thana: z.string().nullable(),
    qty: z.number().int().positive().nullable(),
    variant: z.string().nullable(),
  }),
  missing: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  // Set true for complaints, refund demands, abuse, or anything the model
  // is unsure how to handle. Escalation is cheap; a wrong answer is not.
  escalate: z.boolean(),
});

export type Extraction = z.infer<typeof Extraction>;

// ---------------------------------------------------------------------------
// Phone. Bangladesh mobile numbers only.
// ---------------------------------------------------------------------------

const BD_LOCAL = /^01[3-9]\d{8}$/;

export function normalizeBdPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  // Reduce every accepted form to the 11-digit local form 01XXXXXXXXX.
  // Stripping the 880 country code leaves the national number without its
  // trunk 0, so re-add it (and tolerate a redundant 0 after the country code).
  const local = digits.startsWith('880') ? `0${digits.slice(3).replace(/^0/, '')}`
    : digits.startsWith('0') ? digits
    : `0${digits}`;
  return BD_LOCAL.test(local) ? `+880${local.slice(1)}` : null;
}

// ---------------------------------------------------------------------------
// Address. A district that does not resolve against the canonical list means
// the parcel is undeliverable — ask again rather than book it.
// Seed the full list from packages/db/seed/bd-geo.json before going live.
// ---------------------------------------------------------------------------

export interface GeoResolver {
  resolveDistrict(input: string): string | null;
  resolveThana(district: string, input: string): string | null;
}

export function addressIsDeliverable(
  geo: GeoResolver,
  a: { district: string | null; thana: string | null; address_raw: string | null },
): { ok: boolean; reason?: string } {
  if (!a.address_raw || a.address_raw.trim().length < 12) {
    return { ok: false, reason: 'address_too_short' };
  }
  const d = a.district ? geo.resolveDistrict(a.district) : null;
  if (!d) return { ok: false, reason: 'district_unresolved' };
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Guardrail. The model may not invent a price, a delivery time, or a discount.
// Runs on every draft before it is sent or shown. Failure = escalate to human.
// ---------------------------------------------------------------------------

export function findUngroundedNumbers(reply: string, allowed: number[]): number[] {
  const found = [...reply.matchAll(/\d[\d,]*(?:\.\d+)?/g)]
    .map((m) => Number(m[0].replace(/,/g, '')))
    .filter((n) => Number.isFinite(n));
  const permitted = new Set(allowed);
  // Digits 1-9 are almost always quantities the customer just stated.
  return found.filter((n) => n > 9 && !permitted.has(n));
}

export class GuardrailViolation extends Error {
  constructor(public readonly numbers: number[]) {
    super(`Reply contains ungrounded numbers: ${numbers.join(', ')}`);
  }
}
