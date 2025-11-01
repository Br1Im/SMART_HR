import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany();
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        blocks: {
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    if (!course) {
      return null;
    }

    // Преобразуем блоки в структуру модулей и уроков
    const modules = [];
    const moduleBlocks = course.blocks.filter(block => block.type === 'MODULE');
    const lessonBlocks = course.blocks.filter(block => block.type !== 'MODULE');

    for (const moduleBlock of moduleBlocks) {
      const module = {
        id: moduleBlock.id,
        title: moduleBlock.title,
        description: moduleBlock.content || '',
        position: moduleBlock.position,
        lessons: lessonBlocks
          .filter(lesson => lesson.position > moduleBlock.position && 
                          (moduleBlocks.find(m => m.position > moduleBlock.position && m.position < lesson.position) === undefined))
          .map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content || '',
            type: lesson.type,
            position: lesson.position,
            blocks: [lesson] // Для совместимости с существующим кодом
          }))
      };
      modules.push(module);
    }

    return {
      ...course,
      modules
    };
  }

  async create(createCourseDto: any, authorId: string) {
    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        authorId,
      },
    });
  }

  async update(id: string, updateCourseDto: any) {
    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async remove(id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }

  // Методы для работы с избранными курсами
  async addToFavorites(userId: string, courseId: string) {
    return this.prisma.favoriteCourse.create({
      data: {
        userId,
        courseId,
      },
    });
  }

  async removeFromFavorites(userId: string, courseId: string) {
    return this.prisma.favoriteCourse.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  }

  async getFavorites(userId: string) {
    return this.prisma.favoriteCourse.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });
  }

  async isFavorite(userId: string, courseId: string) {
    const favorite = await this.prisma.favoriteCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    return !!favorite;
  }

  // Методы для работы с начатыми курсами
  async markAsStarted(userId: string, courseId: string) {
    return this.prisma.startedCourse.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        updatedAt: new Date(),
      },
      create: {
        userId,
        courseId,
      },
    });
  }

  async getStartedCourses(userId: string) {
    return this.prisma.startedCourse.findMany({
      where: { userId },
      include: {
        course: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async isStarted(userId: string, courseId: string) {
    const started = await this.prisma.startedCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    return !!started;
  }

  // Получение курсов с информацией о статусе для пользователя
  async findAllWithUserStatus(userId: string) {
    const courses = await this.prisma.course.findMany();
    
    const coursesWithStatus = await Promise.all(
      courses.map(async (course) => {
        const [isFavorite, isStarted] = await Promise.all([
          this.isFavorite(userId, course.id),
          this.isStarted(userId, course.id),
        ]);
        
        return {
          ...course,
          isFavorite,
          isStarted,
        };
      })
    );
    
    return coursesWithStatus;
  }
}