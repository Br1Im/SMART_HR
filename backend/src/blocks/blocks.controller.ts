import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('blocks')
@UseGuards(JwtAuthGuard, RbacGuard)
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @RequirePermissions({ resource: 'blocks', action: 'read' })
  @Get('course/:courseId')
  findAll(@Param('courseId') courseId: string) {
    return this.blocksService.findAll(courseId);
  }

  @RequirePermissions({ resource: 'blocks', action: 'read' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blocksService.findOne(id);
  }

  @RequirePermissions({ resource: 'blocks', action: 'create' })
  @Post()
  create(@Body() createBlockDto: CreateBlockDto) {
    return this.blocksService.create(createBlockDto);
  }

  @RequirePermissions({ resource: 'blocks', action: 'update' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockDto) {
    return this.blocksService.update(id, updateBlockDto);
  }

  @RequirePermissions({ resource: 'blocks', action: 'delete' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blocksService.remove(id);
  }

  @RequirePermissions({ resource: 'blocks', action: 'update' })
  @Post('reorder')
  reorder(@Body() data: { courseId: string; blockIds: string[] }) {
    return this.blocksService.reorder(data.courseId, data.blockIds);
  }
}