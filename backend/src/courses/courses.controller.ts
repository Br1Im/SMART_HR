import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions({ resource: 'courses', action: 'read' })
  @Get()
  findAll(@Request() req) {
    // Если пользователь обычный (не ADMIN/CURATOR), возвращаем курсы с информацией о статусе
    if (req.user.role === 'CLIENT' || req.user.role === 'CANDIDATE') {
      return this.coursesService.findAllWithUserStatus(req.user.id);
    }
    return this.coursesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions({ resource: 'courses', action: 'read' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions({ resource: 'courses', action: 'create' })
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    return this.coursesService.create(createCourseDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions({ resource: 'courses', action: 'update' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions({ resource: 'courses', action: 'delete' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  // Endpoints для избранных курсов
  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  addToFavorites(@Param('id') courseId: string, @Request() req) {
    return this.coursesService.addToFavorites(req.user.id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorite')
  removeFromFavorites(@Param('id') courseId: string, @Request() req) {
    return this.coursesService.removeFromFavorites(req.user.id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites/my')
  getFavorites(@Request() req) {
    return this.coursesService.getFavorites(req.user.id);
  }

  // Endpoints для начатых курсов
  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  markAsStarted(@Param('id') courseId: string, @Request() req) {
    return this.coursesService.markAsStarted(req.user.id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('started/my')
  getStartedCourses(@Request() req) {
    return this.coursesService.getStartedCourses(req.user.id);
  }
}