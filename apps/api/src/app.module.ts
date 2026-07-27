import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { resolve } from 'node:path';
import { validateEnv } from './config/env.js';
import { DevController } from './dev.controller.js';
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
    // The single .env lives at the repo root; the API runs from apps/api, so
    // point ConfigModule up two levels (falling back to a local .env).
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: [resolve(process.cwd(), '../../.env'), '.env'],
    }),
    BullModule.forRoot({ connection: redisConnection() }),
    MessengerModule,
    WhatsappModule,
    AiModule,
    OrdersModule,
    CourierModule,
    ReportingModule,
  ],
  controllers: [HealthController, DevController],
})
export class AppModule {}
