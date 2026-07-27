import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { withTenant, orders, contacts, auditEvents, type Database } from '@orderpilot/db';
import { COURIER_ADAPTER, CourierAdapter } from '../courier/courier.interface.js';

export interface CreateOrderInput {
  contactId: string;
  conversationId?: string;
  variant: string;
  qty: number;
  unitPrice: number;
  deliveryFee: number;
}

@Injectable()
export class OrdersService {
  private readonly log = new Logger(OrdersService.name);

  constructor(@Inject(COURIER_ADAPTER) private readonly courier: CourierAdapter) {}

  async list(tenantId: string, state?: string) {
    return withTenant(tenantId, (tx: Database) =>
      tx
        .select()
        .from(orders)
        .where(state ? and(eq(orders.tenantId, tenantId), eq(orders.state, state as any)) : eq(orders.tenantId, tenantId))
        .orderBy(desc(orders.createdAt))
        .limit(200),
    );
  }

  async create(tenantId: string, input: CreateOrderInput) {
    const total = input.unitPrice * input.qty + input.deliveryFee;
    return withTenant(tenantId, async (tx: Database) => {
      const [order] = await tx
        .insert(orders)
        .values({
          tenantId,
          contactId: input.contactId,
          conversationId: input.conversationId,
          variant: input.variant,
          qty: input.qty,
          unitPrice: input.unitPrice.toFixed(2),
          deliveryFee: input.deliveryFee.toFixed(2),
          total: total.toFixed(2),
          state: 'draft',
        })
        .returning();
      await this.audit(tx, tenantId, 'order.create', order.id, { total });
      return order;
    });
  }

  async confirm(tenantId: string, orderId: string) {
    return withTenant(tenantId, async (tx: Database) => {
      const [order] = await tx
        .update(orders)
        .set({ state: 'confirmed', confirmedAt: new Date() })
        .where(and(eq(orders.tenantId, tenantId), eq(orders.id, orderId), eq(orders.state, 'draft')))
        .returning();
      if (!order) throw new NotFoundException('order not in draft state');
      await this.audit(tx, tenantId, 'order.confirm', orderId, {});
      return order;
    });
  }

  /**
   * Book with the courier. The fraud check runs BEFORE booking: a phone number
   * with a high refusal history is the single strongest predictor of a returned
   * COD parcel. We store the score and still book, but the UI surfaces it so the
   * seller can require an advance delivery fee for risky numbers.
   */
  async book(tenantId: string, orderId: string) {
    return withTenant(tenantId, async (tx: Database) => {
      const [order] = await tx
        .select()
        .from(orders)
        .where(and(eq(orders.tenantId, tenantId), eq(orders.id, orderId)));
      if (!order) throw new NotFoundException('order not found');
      if (order.state !== 'confirmed') throw new NotFoundException('order not in confirmed state');

      const [contact] = await tx.select().from(contacts).where(eq(contacts.id, order.contactId));
      if (!contact?.phoneE164 || !contact.addressRaw) {
        throw new NotFoundException('contact is missing a phone or address');
      }

      let fraudScore: number | null = null;
      if (this.courier.fraudCheck) {
        const fc = await this.courier.fraudCheck(contact.phoneE164);
        fraudScore = fc.returnRate;
      }

      const result = await this.courier.book({
        invoiceId: order.id,
        recipientName: contact.name ?? 'Customer',
        recipientPhone: contact.phoneE164,
        recipientAddress: contact.addressRaw,
        codAmount: Number(order.total),
      });

      const [booked] = await tx
        .update(orders)
        .set({
          state: 'booked',
          bookedAt: new Date(),
          courier: this.courier.name,
          consignmentId: result.consignmentId,
          fraudScore: fraudScore?.toFixed(3),
        })
        .where(eq(orders.id, order.id))
        .returning();

      await this.audit(tx, tenantId, 'order.book', order.id, {
        courier: this.courier.name,
        consignmentId: result.consignmentId,
        fraudScore,
      });
      return booked;
    });
  }

  /** Reconcile local state from the courier — driven by a nightly poll or webhook. */
  async syncStatus(tenantId: string, orderId: string) {
    return withTenant(tenantId, async (tx: Database) => {
      const [order] = await tx
        .select()
        .from(orders)
        .where(and(eq(orders.tenantId, tenantId), eq(orders.id, orderId)));
      if (!order?.consignmentId) throw new NotFoundException('order not booked');

      const status = await this.courier.status(order.consignmentId);
      const patch: Record<string, unknown> = {};
      if (status === 'delivered') Object.assign(patch, { state: 'delivered', deliveredAt: new Date() });
      else if (status === 'returned') Object.assign(patch, { state: 'returned', returnedAt: new Date() });
      else if (status === 'in_transit') Object.assign(patch, { state: 'in_transit' });

      if (Object.keys(patch).length > 0) {
        await tx.update(orders).set(patch).where(eq(orders.id, order.id));
        await this.audit(tx, tenantId, 'order.status', order.id, { status });
      }
      return { status };
    });
  }

  private async audit(tx: Database, tenantId: string, action: string, entityId: string, payload: object) {
    await tx.insert(auditEvents).values({
      tenantId,
      actor: 'system',
      action,
      entityType: 'order',
      entityId,
      payload,
    });
  }
}
