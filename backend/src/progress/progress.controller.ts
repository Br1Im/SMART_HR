import { Controller, Post, Get, Param, Request, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Отметить урок как завершенный
  @Post('lesson/:lessonId/complete')
  async markLessonComplete(
    @Param('lessonId') lessonId: string,
    @Request() req,
    @Body() body: { courseId: string }
  ) {
    return this.progressService.markLessonComplete(req.user.id, lessonId, body.courseId);
  }

  // Получить прогресс по курсу
  @Get('course/:courseId')
  async getCourseProgress(
    @Param('courseId') courseId: string,
    @Request() req
  ) {
    return this.progressService.getCourseProgress(req.user.id, courseId);
  }

  // Получить прогресс по всем курсам пользователя
  @Get('my')
  async getMyProgress(@Request() req) {
    return this.progressService.getUserProgress(req.user.id);
  }

  // Получить завершенные уроки для курса
  @Get('course/:courseId/lessons')
  async getCompletedLessons(
    @Param('courseId') courseId: string,
    @Request() req
  ) {
    return this.progressService.getCompletedLessons(req.user.id, courseId);
  }
}