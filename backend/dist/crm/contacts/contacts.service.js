"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ContactsService = class ContactsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createContactDto, userId, userRole) {
        const organization = await this.prisma.org.findUnique({
            where: { id: createContactDto.orgId },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Организация не найдена');
        }
        if (userRole === 'CLIENT' && organization.ownerId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к этой организации');
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
    async findAll(userId, userRole, page = 1, limit = 10, search, orgId) {
        const skip = (page - 1) * limit;
        const where = {};
        if (userRole === 'CLIENT') {
            where.organization = {
                ownerId: userId,
            };
        }
        if (orgId) {
            where.orgId = orgId;
            if (userRole === 'CLIENT') {
                const organization = await this.prisma.org.findUnique({
                    where: { id: orgId },
                });
                if (!organization || organization.ownerId !== userId) {
                    throw new common_1.ForbiddenException('Нет доступа к этой организации');
                }
            }
        }
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
    async findOne(id, userId, userRole) {
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
            throw new common_1.NotFoundException('Контакт не найден');
        }
        if (userRole === 'CLIENT' && contact.organization.ownerId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к этому контакту');
        }
        return contact;
    }
    async update(id, updateContactDto, userId, userRole) {
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
            throw new common_1.NotFoundException('Контакт не найден');
        }
        if (userRole === 'CLIENT' && contact.organization.ownerId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к этому контакту');
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
    async remove(id, userId, userRole) {
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
            throw new common_1.NotFoundException('Контакт не найден');
        }
        if (userRole === 'CLIENT' && contact.organization.ownerId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к этому контакту');
        }
        await this.prisma.contact.delete({
            where: { id },
        });
        return { message: 'Контакт успешно удален' };
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map