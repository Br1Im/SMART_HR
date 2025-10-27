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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Resource, Action } from '../../auth/decorators/resource.decorator';

@Controller('contacts')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'CLIENT')
  @Resource('contacts')
  @Action('create')
  create(@Body() createContactDto: CreateContactDto, @Request() req) {
    return this.contactsService.create(createContactDto, req.user.id, req.user.role);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'CLIENT')
  @Resource('contacts')
  @Action('read')
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orgId') orgId?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.contactsService.findAll(
      req.user.id,
      req.user.role,
      pageNum,
      limitNum,
      search,
      orgId,
    );
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'CLIENT')
  @Resource('contacts')
  @Action('read')
  findOne(@Param('id') id: string, @Request() req) {
    return this.contactsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER', 'CLIENT')
  @Resource('contacts')
  @Action('update')
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Request() req,
  ) {
    return this.contactsService.update(
      id,
      updateContactDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER', 'CLIENT')
  @Resource('contacts')
  @Action('delete')
  remove(@Param('id') id: string, @Request() req) {
    return this.contactsService.remove(id, req.user.id, req.user.role);
  }
}