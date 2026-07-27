import { Controller, Get } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from '@orderpilot/db';

@Controller('health')
export class HealthController {
  @Get()
  async check() {
    await db().execute(sql`SELECT 1`);
    return { ok: true, ts: new Date().toISOString() };
  }
}
