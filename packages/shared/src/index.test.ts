import { describe, it, expect } from 'vitest';
import { normalizeBdPhone, findUngroundedNumbers, addressIsDeliverable, GeoResolver } from './index.js';

describe('normalizeBdPhone', () => {
  it('accepts a local 01X number', () => {
    expect(normalizeBdPhone('01712345678')).toBe('+8801712345678');
  });
  it('accepts a number with country code and separators', () => {
    expect(normalizeBdPhone('+880 1712-345678')).toBe('+8801712345678');
  });
  it('accepts a bare number missing the leading zero', () => {
    expect(normalizeBdPhone('1712345678')).toBe('+8801712345678');
  });
  it('rejects a non-BD or malformed number', () => {
    expect(normalizeBdPhone('12345')).toBeNull();
    expect(normalizeBdPhone('01212345678')).toBeNull(); // 012 is not a valid operator prefix
    expect(normalizeBdPhone(null)).toBeNull();
  });
});

describe('findUngroundedNumbers', () => {
  it('passes a reply whose numbers are all grounded', () => {
    expect(findUngroundedNumbers('Price 850 taka, delivery 60.', [850, 60])).toEqual([]);
  });
  it('flags an invented discount', () => {
    expect(findUngroundedNumbers('Special 20% off, now 680 taka!', [850, 60])).toEqual([20, 680]);
  });
  it('ignores small quantities the customer stated', () => {
    expect(findUngroundedNumbers('Sure, 2 pieces confirmed.', [])).toEqual([]);
  });
});

describe('addressIsDeliverable', () => {
  const geo: GeoResolver = {
    resolveDistrict: (d) => (d.toLowerCase() === 'dhaka' ? 'Dhaka' : null),
    resolveThana: () => null,
  };
  it('rejects a too-short address', () => {
    expect(addressIsDeliverable(geo, { district: 'Dhaka', thana: null, address_raw: 'here' }).ok).toBe(false);
  });
  it('rejects an unresolved district', () => {
    const r = addressIsDeliverable(geo, { district: 'Atlantis', thana: null, address_raw: 'House 12, Road 3, Block A' });
    expect(r).toEqual({ ok: false, reason: 'district_unresolved' });
  });
  it('accepts a resolvable, long-enough address', () => {
    expect(addressIsDeliverable(geo, { district: 'Dhaka', thana: null, address_raw: 'House 12, Road 3, Block A, Banani' }).ok).toBe(true);
  });
});
