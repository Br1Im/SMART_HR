import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Resource, Action } from '../auth/decorators/resource.decorator';
import { AuditAction } from './audit-action.enum';

@Controller('audit')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'CLIENT')
  @Resource('audit')
  @Action('read')
  getAuditLogs(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('entity') entity?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const actionEnum = action as AuditAction;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.auditService.getAuditLogs(
      req.user.userId,
      req.user.role,
      pageNum,
      limitNum,
      entity,
      actionEnum,
      start,
      end,
    );
  }

  @Get('stats')
  @Roles('ADMIN', 'MANAGER', 'CLIENT')
  @Resource('audit')
  @Action('read')
  getAuditStats(@Request() req) {
    return this.auditService.getAuditStats(req.user.userId, req.user.role);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'CLIENT')
  @Resource('audit')
  @Action('read')
  getAuditLog(@Param('id') id: string, @Request() req) {
    return this.auditService.getAuditLogById(id, req.user.userId, req.user.role);
  }
}