import { describe, it, expect, vi } from 'vitest';
import { OutboundService, WindowClosedError } from './outbound.service.js';

describe('OutboundService window enforcement', () => {
  const svc = new OutboundService();

  it('refuses to send outside the window with no tag', async () => {
    await expect(
      svc.send({
        conversationId: 'c1',
        psid: 'p1',
        pageAccessToken: 't',
        text: 'still interested?',
        windowExpiresAt: new Date(Date.now() - 1000), // expired
      }),
    ).rejects.toBeInstanceOf(WindowClosedError);
  });

  it('sends inside the window', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message_id: 'mid_123' }), { status: 200 }),
    );
    const res = await svc.send({
      conversationId: 'c1',
      psid: 'p1',
      pageAccessToken: 't',
      text: 'hello',
      windowExpiresAt: new Date(Date.now() + 60_000),
    });
    expect(res.messageId).toBe('mid_123');
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.messaging_type).toBe('RESPONSE');
    fetchMock.mockRestore();
  });

  it('allows a tagged send outside the window', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message_id: 'mid_tag' }), { status: 200 }),
    );
    const res = await svc.send({
      conversationId: 'c1',
      psid: 'p1',
      pageAccessToken: 't',
      text: 'Your order has shipped',
      windowExpiresAt: new Date(Date.now() - 1000),
      tag: 'POST_PURCHASE_UPDATE',
    });
    expect(res.messageId).toBe('mid_tag');
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.messaging_type).toBe('MESSAGE_TAG');
    expect(body.tag).toBe('POST_PURCHASE_UPDATE');
    fetchMock.mockRestore();
  });
});
