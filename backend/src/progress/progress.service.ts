import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  // Отметить урок как завершенный
  async markLessonComplete(userId: string, lessonId: string, courseId: string) {
    // Создаем или обновляем прогресс урока
    const lessonProgress = await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        courseId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Обновляем общий прогресс по курсу
    await this.updateCourseProgress(userId, courseId);

    return lessonProgress;
  }

  // Обновить общий прогресс по курсу
  async updateCourseProgress(userId: string, courseId: string) {
    // Получаем все уроки курса
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        blocks: {
          where: { type: 'LESSON' },
        },
      },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const totalLessons = course.blocks.length;

    // Получаем количество завершенных уроков
    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        userId,
        courseId,
        isCompleted: true,
      },
    });

    const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    const isCompleted = completedLessons === totalLessons && totalLessons > 0;

    // Создаем или обновляем прогресс курса
    const courseProgress = await this.prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        completedLessons,
        totalLessons,
        progressPercent,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date(),
      },
      create: {
        userId,
        courseId,
        completedLessons,
        totalLessons,
        progressPercent,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return courseProgress;
  }

  // Получить прогресс по курсу
  async getCourseProgress(userId: string, courseId: string) {
    const courseProgress = await this.prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!courseProgress) {
      // Если прогресса нет, создаем начальный
      return this.updateCourseProgress(userId, courseId);
    }

    return courseProgress;
  }

  // Получить прогресс по всем курсам пользователя
  async getUserProgress(userId: string) {
    return this.prisma.courseProgress.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  // Получить завершенные уроки для курса
  async getCompletedLessons(userId: string, courseId: string) {
    const completedLessons = await this.prisma.lessonProgress.findMany({
      where: {
        userId,
        courseId,
        isCompleted: true,
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    return completedLessons.map(progress => ({
      lessonId: progress.lessonId,
      lesson: progress.lesson,
      completedAt: progress.completedAt,
    }));
  }

  // Проверить, завершен ли урок
  async isLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
    const progress = await this.prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    return progress?.isCompleted || false;
  }
}