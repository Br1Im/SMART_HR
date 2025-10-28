import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Resource, Action } from '../../auth/decorators/resource.decorator';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RbacGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Roles('ADMIN', 'CURATOR')
  @Resource('organizations')
  @Action('create')
  create(@Body() createOrganizationDto: CreateOrganizationDto, @Request() req) {
    return this.organizationsService.create(createOrganizationDto, req.user.id);
  }

  @Get()
  @Roles('ADMIN', 'CURATOR', 'CLIENT', 'CANDIDATE')
  @Resource('organizations')
  @Action('read')
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    
    return this.organizationsService.findAll(
      req.user.id,
      req.user.role,
      pageNum,
      limitNum,
      search,
    );
  }

  @Get(':id')
  @Roles('ADMIN', 'CURATOR', 'CLIENT', 'CANDIDATE')
  @Resource('organizations')
  @Action('read')
  findOne(@Param('id') id: string, @Request() req) {
    return this.organizationsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles('ADMIN', 'CURATOR')
  @Resource('organizations')
  @Action('update')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @Request() req,
  ) {
    return this.organizationsService.update(
      id,
      updateOrganizationDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles('ADMIN', 'CURATOR')
  @Resource('organizations')
  @Action('delete')
  remove(@Param('id') id: string, @Request() req) {
    return this.organizationsService.remove(id, req.user.id, req.user.role);
  }
}