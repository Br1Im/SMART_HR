import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto, userId: string, userRole: string) {
    // Проверяем, что организация существует и пользователь имеет к ней доступ
    const organization = await this.prisma.org.findUnique({
      where: { id: createContactDto.orgId },
    });

    if (!organization) {
      throw new NotFoundException('Организация не найдена');
    }

    // Проверка доступа для клиентов
    if (userRole === 'CLIENT' && organization.ownerId !== userId) {
      throw new ForbiddenException('Нет доступа к этой организации');
    }

    return this.prisma.contact.create({
      data: {
        fullName: createContactDto.fullName,
        email: createContactDto.email,
        phone: createContactDto.phone,
        role: createContactDto.position,
        orgId: createContactDto.orgId,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, userRole: string, page = 1, limit = 10, search?: string, orgId?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    // Клиенты видят только контакты своих организаций
    if (userRole === 'CLIENT') {
      where.organization = {
        ownerId: userId,
      };
    }
    
    // Фильтр по организации
    if (orgId) {
      where.orgId = orgId;
      
      // Дополнительная проверка доступа для клиентов
      if (userRole === 'CLIENT') {
        const organization = await this.prisma.org.findUnique({
          where: { id: orgId },
        });
        
        if (!organization || organization.ownerId !== userId) {
          throw new ForbiddenException('Нет доступа к этой организации');
        }
      }
    }
    
    // Поиск по имени или email
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take: limit,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return {
      data: contacts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string, userRole: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Контакт не найден');
    }

    // Проверка доступа для клиентов
    if (userRole === 'CLIENT' && contact.organization.ownerId !== userId) {
      throw new ForbiddenException('Нет доступа к этому контакту');
    }

    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto, userId: string, userRole: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Контакт не найден');
    }

    // Проверка доступа для клиентов
    if (userRole === 'CLIENT' && contact.organization.ownerId !== userId) {
      throw new ForbiddenException('Нет доступа к этому контакту');
    }

    return this.prisma.contact.update({
      where: { id },
      data: {
        fullName: updateContactDto.fullName,
        email: updateContactDto.email,
        phone: updateContactDto.phone,
        role: updateContactDto.position,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Контакт не найден');
    }

    // Проверка доступа для клиентов
    if (userRole === 'CLIENT' && contact.organization.ownerId !== userId) {
      throw new ForbiddenException('Нет доступа к этому контакту');
    }

    await this.prisma.contact.delete({
      where: { id },
    });

    return { message: 'Контакт успешно удален' };
  }
}