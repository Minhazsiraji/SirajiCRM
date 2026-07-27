import { Controller, ForbiddenException, Get, HttpCode, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MetaSignatureGuard } from '../../common/meta-signature.guard.js';
import { WebhookIntakeService } from '../messenger/webhook-intake.service.js';

/**
 * WhatsApp shares Meta's webhook verification and signature scheme with
 * Messenger. Inbound message handling (upsert contact by wa_id, open a
 * whatsapp-channel conversation, refresh the 24h window) mirrors the Messenger
 * flow and is wired the same way — enqueue and return 200 fast.
 */
@Controller('webhooks/whatsapp')
export class WhatsappController {
  constructor(
    private readonly config: ConfigService,
    private readonly intake: WebhookIntakeService,
  ) {}

  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    if (mode === 'subscribe' && token === this.config.getOrThrow('META_VERIFY_TOKEN')) {
      return challenge;
    }
    throw new ForbiddenException();
  }

  @Post()
  @HttpCode(200)
  @UseGuards(MetaSignatureGuard)
  async receive(@Body() body: any): Promise<{ ok: true }> {
    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        for (const message of change.value?.messages ?? []) {
          await this.intake.recordOnce('whatsapp', message.id, { entryId: entry.id, message });
          // TODO(week 3): enqueue on the shared 'inbound' queue with channel=whatsapp.
        }
      }
    }
    return { ok: true };
  }
}
