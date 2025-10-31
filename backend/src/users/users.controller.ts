import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Resource, Action } from '../auth/decorators/resource.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RbacGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'CLIENT')
  @Resource('users')
  @Action('read')
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.usersService.findAll(
      req.user.id,
      req.user.role,
      pageNum,
      limitNum,
      search,
      role,
    );
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'CLIENT')
  @Resource('users')
  @Action('read')
  findOne(@Param('id') id: string, @Request() req) {
    return this.usersService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  @Resource('users')
  @Action('update')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(id, updateUserDto, req.user.id, req.user.role);
  }
}