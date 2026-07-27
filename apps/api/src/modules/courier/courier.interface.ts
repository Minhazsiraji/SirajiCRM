export interface BookingRequest {
  invoiceId: string;      // our order id — becomes the courier's merchant reference
  recipientName: string;
  recipientPhone: string; // +8801XXXXXXXXX
  recipientAddress: string;
  codAmount: number;      // total to collect at the door, in taka
  note?: string;
}

export interface BookingResult {
  consignmentId: string;
  trackingCode: string;
  status: string;
}

export type DeliveryStatus =
  | 'pending'
  | 'in_transit'
  | 'delivered'
  | 'returned'
  | 'cancelled'
  | 'unknown';

/**
 * A single COD courier's returns are structural: some run 30%+ returns in some
 * districts. `fraudCheck` (where the provider offers it) returns the fraction of
 * this phone number's past parcels that were refused — the one number worth
 * knowing before you dispatch. Higher means require an advance delivery fee.
 */
export interface CourierAdapter {
  readonly name: string;
  book(req: BookingRequest): Promise<BookingResult>;
  status(consignmentId: string): Promise<DeliveryStatus>;
  fraudCheck?(phoneE164: string): Promise<{ returnRate: number | null }>;
}

export const COURIER_ADAPTER = Symbol('COURIER_ADAPTER');
