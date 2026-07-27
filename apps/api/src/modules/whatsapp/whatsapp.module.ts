import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller.js';
import { WhatsappOutboundService } from './whatsapp-outbound.service.js';
import { WebhookIntakeService } from '../messenger/webhook-intake.service.js';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappOutboundService, WebhookIntakeService],
  exports: [WhatsappOutboundService],
})
export class WhatsappModule {}
