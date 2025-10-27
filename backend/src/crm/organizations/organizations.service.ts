import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto, userId: string) {
    return this.prisma.org.create({
      data: {
        name: createOrganizationDto.name,
        inn: createOrganizationDto.inn,
        site: createOrganizationDto.site,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        contacts: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            contacts: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, userRole: string, page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    // Клиенты видят только свои организации
    if (userRole === 'CANDIDATE') {
      where.ownerId = userId;
    }
    
    // Поиск по названию или описанию
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [organizations, total] = await Promise.all([
      this.prisma.org.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          _count: {
            select: {
              contacts: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.org.count({ where }),
    ]);

    return {
      data: organizations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string, userRole: string) {
    const organization = await this.prisma.org.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        contacts: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Организация не найдена');
    }

    // Проверка доступа для клиентов
    if (userRole === 'CANDIDATE' && organization.ownerId !== userId) {
      throw new ForbiddenException('Нет доступа к этой организации');
    }

    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto, userId: string, userRole: string) {
    const organization = await this.prisma.org.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Организация не найдена');
    }

    // Проверка доступа для клиентов
    if (userRole === 'CANDIDATE' && organization.ownerId !== userId) {
      throw new ForbiddenException('Нет доступа к этой организации');
    }

    return this.prisma.org.update({
      where: { id },
      data: updateOrganizationDto,
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            contacts: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const organization = await this.prisma.org.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Организация не найдена');
    }

    // Проверка доступа для клиентов
    if (userRole === 'CANDIDATE' && organization.ownerId !== userId) {
      throw new ForbiddenException('Нет доступа к этой организации');
    }

    await this.prisma.org.delete({
      where: { id },
    });

    return { message: 'Организация успешно удалена' };
  }
}