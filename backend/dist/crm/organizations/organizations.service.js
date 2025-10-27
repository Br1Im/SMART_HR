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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let OrganizationsService = class OrganizationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrganizationDto, userId) {
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
    async findAll(userId, userRole, page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (userRole === 'CANDIDATE') {
            where.ownerId = userId;
        }
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
    async findOne(id, userId, userRole) {
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
            throw new common_1.NotFoundException('Организация не найдена');
        }
        if (userRole === 'CANDIDATE' && organization.ownerId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к этой организации');
        }
        return organization;
    }
    async update(id, updateOrganizationDto, userId, userRole) {
        const organization = await this.prisma.org.findUnique({
            where: { id },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Организация не найдена');
        }
        if (userRole === 'CANDIDATE' && organization.ownerId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к этой организации');
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
    async remove(id, userId, userRole) {
        const organization = await this.prisma.org.findUnique({
            where: { id },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Организация не найдена');
        }
        if (userRole === 'CANDIDATE' && organization.ownerId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к этой организации');
        }
        await this.prisma.org.delete({
            where: { id },
        });
        return { message: 'Организация успешно удалена' };
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map