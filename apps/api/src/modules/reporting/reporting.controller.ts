import { Controller, Get } from '@nestjs/common';
import { TenantId } from '../../common/tenant.decorator.js';
import { ReportingService } from './reporting.service.js';

@Controller('reporting')
export class ReportingController {
  constructor(private readonly reporting: ReportingService) {}

  @Get('headline')
  headline(@TenantId() tenantId: string) {
    return this.reporting.headline(tenantId);
  }

  @Get('ads')
  ads(@TenantId() tenantId: string) {
    return this.reporting.adPerformance(tenantId);
  }

  @Get('districts')
  districts(@TenantId() tenantId: string) {
    return this.reporting.districtPerformance(tenantId);
  }
}
