import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MessengerController } from './messenger.controller.js';
import { WebhookIntakeService } from './webhook-intake.service.js';
import { ConversationService } from './conversation.service.js';
import { OutboundService } from './outbound.service.js';
import { InboundProcessor } from './inbound.processor.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [BullModule.registerQueue({ name: 'inbound' }), AiModule],
  controllers: [MessengerController],
  providers: [WebhookIntakeService, ConversationService, OutboundService, InboundProcessor],
  exports: [ConversationService, OutboundService],
})
export class MessengerModule {}
