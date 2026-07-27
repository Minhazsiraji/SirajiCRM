import { Injectable, Logger } from '@nestjs/common';
import {
  CourierAdapter, BookingRequest, BookingResult, DeliveryStatus,
} from './courier.interface.js';

/**
 * Steadfast Courier (steadfast.com.bd) — a common COD courier in Bangladesh.
 * Auth is two headers, Api-Key and Secret-Key. Endpoint shapes are stable but
 * verify them against the current Steadfast API docs before go-live; couriers
 * change response fields without notice.
 */
@Injectable()
export class SteadfastAdapter implements CourierAdapter {
  readonly name = 'steadfast';
  private readonly log = new Logger(SteadfastAdapter.name);
  private readonly base = 'https://portal.steadfast.com.bd/api/v1';

  private headers() {
    const key = process.env.COURIER_API_KEY;
    const secret = process.env.COURIER_API_SECRET;
    if (!key || !secret) throw new Error('Steadfast not configured (COURIER_API_KEY / COURIER_API_SECRET)');
    return { 'Api-Key': key, 'Secret-Key': secret, 'content-type': 'application/json' };
  }

  async book(req: BookingRequest): Promise<BookingResult> {
    const res = await fetch(`${this.base}/create_order`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        invoice: req.invoiceId,
        recipient_name: req.recipientName,
        recipient_phone: req.recipientPhone.replace('+88', ''),
        recipient_address: req.recipientAddress,
        cod_amount: req.codAmount,
        note: req.note ?? '',
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      this.log.error(`Steadfast book failed: ${res.status} ${detail}`);
      throw new Error(`courier_book_failed_${res.status}`);
    }
    const json = (await res.json()) as {
      consignment?: { consignment_id?: number | string; tracking_code?: string; status?: string };
    };
    const c = json.consignment ?? {};
    return {
      consignmentId: String(c.consignment_id ?? ''),
      trackingCode: c.tracking_code ?? '',
      status: c.status ?? 'pending',
    };
  }

  async status(consignmentId: string): Promise<DeliveryStatus> {
    const res = await fetch(`${this.base}/status_by_cid/${consignmentId}`, { headers: this.headers() });
    if (!res.ok) return 'unknown';
    const json = (await res.json()) as { delivery_status?: string };
    return this.mapStatus(json.delivery_status);
  }

  async fraudCheck(phoneE164: string): Promise<{ returnRate: number | null }> {
    // Steadfast exposes a fraud/return-history lookup by phone. Field names vary
    // by account tier; fall back to null rather than blocking a booking.
    try {
      const phone = phoneE164.replace('+88', '');
      const res = await fetch(`${this.base}/fraud_check/${phone}`, { headers: this.headers() });
      if (!res.ok) return { returnRate: null };
      const json = (await res.json()) as { total_delivered?: number; total_cancelled?: number };
      const delivered = json.total_delivered ?? 0;
      const cancelled = json.total_cancelled ?? 0;
      const denom = delivered + cancelled;
      return { returnRate: denom > 0 ? cancelled / denom : null };
    } catch {
      return { returnRate: null };
    }
  }

  private mapStatus(s: string | undefined): DeliveryStatus {
    switch (s) {
      case 'delivered':
      case 'partial_delivered':
        return 'delivered';
      case 'cancelled':
        return 'cancelled';
      case 'in_review':
      case 'pending':
        return 'pending';
      case 'delivered_approval_pending':
      case 'hold':
        return 'in_transit';
      case 'unknown':
        return 'unknown';
      default:
        return s?.includes('return') ? 'returned' : 'unknown';
    }
  }
}
