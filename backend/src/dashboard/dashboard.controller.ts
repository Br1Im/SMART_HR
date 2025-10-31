import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Resource, Action } from '../auth/decorators/resource.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RbacGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles('ADMIN', 'CURATOR', 'CLIENT', 'CANDIDATE')
  @Resource('dashboard')
  @Action('read')
  async getDashboardStats(@Request() req) {
    return this.dashboardService.getDashboardStats(req.user.id, req.user.role);
  }
}