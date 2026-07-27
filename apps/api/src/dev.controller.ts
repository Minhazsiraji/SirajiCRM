import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { db, tenants } from '@orderpilot/db';

/**
 * Local-development conveniences. Disabled outside development so it can never
 * leak tenant ids in production — there, the web app derives the tenant from the
 * signed-in session instead. See apps/api/src/common/tenant.decorator.ts.
 */
@Controller('dev')
export class DevController {
  constructor(private readonly config: ConfigService) {}

  /** The seeded demo tenant, so the dashboard has something to render locally. */
  @Get('demo-tenant')
  async demoTenant(): Promise<{ id: string | null }> {
    if (this.config.get('NODE_ENV') === 'production') throw new NotFoundException();
    const [t] = await db()
      .select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.slug, 'demo-shoe-spray'));
    return { id: t?.id ?? null };
  }
}
