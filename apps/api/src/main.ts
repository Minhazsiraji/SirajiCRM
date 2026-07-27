import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // rawBody is required: MetaSignatureGuard verifies the HMAC over the exact
  // bytes Meta signed. Re-serialising the parsed JSON would change them.
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = app.get(ConfigService);
  app.enableCors({ origin: config.get('WEB_URL'), credentials: true });

  const port = config.get<number>('API_PORT') ?? 3001;
  await app.listen(port);
  new Logger('bootstrap').log(`api listening on :${port}`);
}

bootstrap();
