import { Body, Controller, ForbiddenException, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MetaSignatureGuard } from '../../common/meta-signature.guard.js';
import { WebhookIntakeService } from './webhook-intake.service.js';

@Controller('webhooks/messenger')
export class MessengerController {
  constructor(
    private readonly config: ConfigService,
    private readonly intake: WebhookIntakeService,
    @InjectQueue('inbound') private readonly inbound: Queue,
  ) {}

  /** Meta calls this once when you register the webhook URL. */
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

  /**
   * Meta requires a 200 within a few seconds or it retries and eventually
   * disables the subscription. Do nothing here but dedupe and enqueue.
   */
  @Post()
  @HttpCode(200)
  @UseGuards(MetaSignatureGuard)
  async receive(@Body() body: any): Promise<{ ok: true }> {
    for (const entry of body.entry ?? []) {
      for (const event of entry.messaging ?? []) {
        const eventId = event.message?.mid ?? `${entry.id}:${event.timestamp}`;
        const isNew = await this.intake.recordOnce('messenger', eventId, event);
        if (!isNew) continue;

        await this.inbound.add('messenger', {
          pageId: entry.id,
          psid: event.sender?.id,
          text: event.message?.text ?? null,
          mid: event.message?.mid ?? null,
          timestamp: event.timestamp,
          // Attribution. Present when the customer clicked "Send Message" on an
          // ad or used an m.me link with a ref. Store it or you can never
          // compute cost per delivered order by creative.
          adId: event.referral?.ad_id ?? event.postback?.referral?.ad_id ?? null,
          adRef: event.referral?.ref ?? event.postback?.referral?.ref ?? null,
          entryPoint: event.referral?.source ?? null,
        }, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
      }

      // Public comments on ads and posts. One private reply is permitted per
      // comment, and it opens the 24-hour window. This is the growth mechanic.
      for (const change of entry.changes ?? []) {
        if (change.field !== 'feed') continue;
        if (change.value?.item !== 'comment') continue;
        if (change.value?.verb !== 'add') continue;

        const commentId = change.value.comment_id;
        const isNew = await this.intake.recordOnce('messenger', `comment:${commentId}`, change.value);
        if (!isNew) continue;

        await this.inbound.add('comment', {
          pageId: entry.id,
          commentId,
          postId: change.value.post_id,
          text: change.value.message ?? '',
          fromId: change.value.from?.id,
        }, { attempts: 3 });
      }
    }
    return { ok: true };
  }
}
