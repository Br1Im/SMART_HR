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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAuditLog(userId, action, entity, entityId, details) {
        try {
            return await this.prisma.auditLog.create({
                data: {
                    userId,
                    action,
                    entity,
                    entityId,
                    details: details ? JSON.stringify(details) : null,
                },
            });
        }
        catch (error) {
            console.error('Failed to create audit log:', error);
            return null;
        }
    }
    async getAuditLogs(userId, userRole, page = 1, limit = 10, entity, action, startDate, endDate) {
        const skip = (page - 1) * limit;
        let whereClause = {};
        if (userRole === 'CLIENT') {
            whereClause.userId = userId;
        }
        else if (userRole === 'MANAGER') {
            whereClause.userId = userId;
        }
        if (entity) {
            whereClause.entity = entity;
        }
        if (action) {
            whereClause.action = action;
        }
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate) {
                whereClause.timestamp.gte = startDate;
            }
            if (endDate) {
                whereClause.timestamp.lte = endDate;
            }
        }
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                            role: true,
                        },
                    },
                },
                orderBy: { timestamp: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.auditLog.count({ where: whereClause }),
        ]);
        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getAuditLogById(id, userId, userRole) {
        const log = await this.prisma.auditLog.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        role: true,
                    },
                },
            },
        });
        if (!log) {
            throw new Error('Audit log not found');
        }
        if (userRole === 'CLIENT' && log.userId !== userId) {
            throw new Error('Access denied');
        }
        if (userRole === 'MANAGER' && log.userId !== userId) {
            throw new Error('Access denied');
        }
        return log;
    }
    async getAuditStats(userId, userRole) {
        let whereClause = {};
        if (userRole === 'CLIENT') {
            whereClause.userId = userId;
        }
        else if (userRole === 'MANAGER') {
            whereClause.userId = userId;
        }
        const [totalLogs, actionStats, entityStats, recentActivity] = await Promise.all([
            this.prisma.auditLog.count({ where: whereClause }),
            this.prisma.auditLog.groupBy({
                by: ['action'],
                where: whereClause,
                _count: { action: true },
            }),
            this.prisma.auditLog.groupBy({
                by: ['entity'],
                where: whereClause,
                _count: { entity: true },
            }),
            this.prisma.auditLog.findMany({
                where: {
                    ...whereClause,
                    timestamp: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                },
                orderBy: { timestamp: 'desc' },
                take: 10,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                        },
                    },
                },
            }),
        ]);
        return {
            totalLogs,
            actionStats: actionStats.map(stat => ({
                action: stat.action,
                count: stat._count.action,
            })),
            entityStats: entityStats.map(stat => ({
                entity: stat.entity,
                count: stat._count.entity,
            })),
            recentActivity,
        };
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map