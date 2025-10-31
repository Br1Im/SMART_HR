import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    userRole: string,
    page = 1,
    limit = 10,
    search?: string,
    role?: string,
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    // Поиск по имени или email
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Фильтр по роли
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          // Исключаем пароль из результата
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, requestingUserId: string, requestingUserRole: string) {
    // Пользователи могут видеть только свой профиль, админы и менеджеры - любой
    if (requestingUserRole !== 'ADMIN' && requestingUserRole !== 'MANAGER' && requestingUserId !== id) {
      throw new ForbiddenException('Нет доступа к этому пользователю');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Исключаем пароль из результата
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    requestingUserId: string,
    requestingUserRole: string,
  ) {
    // Только админы и менеджеры могут редактировать пользователей
    if (requestingUserRole !== 'ADMIN' && requestingUserRole !== 'MANAGER') {
      throw new ForbiddenException('Нет прав для редактирования пользователей');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Исключаем пароль из результата
      },
    });

    return updatedUser;
  }
}