import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

/**
 * PLACEHOLDER tenant resolution. Reads the tenant id from the `x-tenant-id`
 * header. Before production, replace this with the tenant claim from a verified
 * Clerk session JWT — a header is trivially spoofable and must never be the
 * source of tenant identity once real users exist. The RLS layer is the actual
 * backstop, but this must still resolve to the authenticated user's tenant.
 */
export const TenantId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest();
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId || typeof tenantId !== 'string') {
    throw new BadRequestException('missing x-tenant-id (placeholder auth — see tenant.decorator.ts)');
  }
  return tenantId;
});
