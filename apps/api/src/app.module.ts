import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { validateEnv } from './config/env.js';
import { MessengerModule } from './modules/messenger/messenger.module.js';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module.js';
import { AiModule } from './modules/ai/ai.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';
import { CourierModule } from './modules/courier/courier.module.js';
import { ReportingModule } from './modules/reporting/reporting.module.js';
import { HealthController } from './health.controller.js';

function redisConnection() {
  const url = new URL(process.env.REDIS_URL ?? 'redis://localhost:6379');
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    password: url.password || undefined,
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    BullModule.forRoot({ connection: redisConnection() }),
    MessengerModule,
    WhatsappModule,
    AiModule,
    OrdersModule,
    CourierModule,
    ReportingModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
