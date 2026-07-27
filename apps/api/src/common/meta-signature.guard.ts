import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';

/**
 * Verifies X-Hub-Signature-256 on every inbound Meta webhook.
 *
 * Without this, anyone who learns your webhook URL can post forged orders,
 * forged customer messages, and forged delivery confirmations. The URL is not
 * a secret — it appears in Meta's dashboard and in your logs.
 *
 * Requires the raw request body:
 *   NestFactory.create(AppModule, { rawBody: true })
 */
@Injectable()
export class MetaSignatureGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const header: string | undefined = req.headers['x-hub-signature-256'];
    const raw: Buffer | undefined = req.rawBody;

    if (!header?.startsWith('sha256=') || !raw) {
      throw new UnauthorizedException('missing signature');
    }

    const secret = this.config.getOrThrow<string>('META_APP_SECRET');
    const expected = crypto.createHmac('sha256', secret).update(raw).digest();
    const received = Buffer.from(header.slice('sha256='.length), 'hex');

    if (received.length !== expected.length) {
      throw new UnauthorizedException('bad signature');
    }
    if (!crypto.timingSafeEqual(received, expected)) {
      throw new UnauthorizedException('bad signature');
    }
    return true;
  }
}
