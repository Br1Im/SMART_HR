import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Ip,
  Headers,
} from '@nestjs/common';
import { ConsentService } from './consent.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Resource, Action } from '../auth/decorators/resource.decorator';
import { ConsentType } from '../common/enums/consent-type.enum';

class GiveConsentDto {
  consentType: string;
}

class WithdrawConsentDto {
  consentType: string;
}

@Controller('consent')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Post('give')
  @Roles('ADMIN', 'MANAGER', 'CLIENT', 'CANDIDATE')
  @Resource('consent')
  @Action('create')
  giveConsent(
    @Body() giveConsentDto: GiveConsentDto,
    @Request() req,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.consentService.giveConsent(
      req.user.id,
      giveConsentDto.consentType as ConsentType,
      ip,
      userAgent,
    );
  }



  @Get('my')
  @Roles('ADMIN', 'MANAGER', 'CLIENT', 'CANDIDATE')
  @Resource('consent')
  @Action('read')
  getUserConsents(@Request() req) {
    return this.consentService.getUserConsents(
      req.user.id,
      req.user.id,
      req.user.role,
    );
  }

  @Get('user/:userId')
  @Roles('ADMIN', 'MANAGER')
  @Resource('consent')
  @Action('read')
  getSpecificUserConsents(@Param('userId') userId: string, @Request() req) {
    return this.consentService.getUserConsents(
      userId,
      req.user.id,
      req.user.role,
    );
  }

  @Get('all')
  @Roles('ADMIN', 'MANAGER')
  @Resource('consent')
  @Action('read')
  getAllConsents(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('consentType') consentType?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.consentService.getAllConsents(
      req.user.id,
      req.user.role,
      pageNum,
      limitNum,
      consentType as ConsentType,
    );
  }

  @Get('stats')
  @Roles('ADMIN', 'MANAGER')
  @Resource('consent')
  @Action('read')
  getConsentStats(@Request() req) {
    return this.consentService.getConsentStats(req.user.id, req.user.role);
  }

  @Get('check/:consentType')
  @Roles('ADMIN', 'MANAGER', 'CLIENT', 'CANDIDATE')
  @Resource('consent')
  @Action('read')
  checkConsent(
    @Param('consentType') consentType: string,
    @Request() req,
  ) {
    return this.consentService.checkUserConsent(req.user.id, consentType as ConsentType);
  }
}