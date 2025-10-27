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
exports.ConsentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const audit_service_1 = require("./audit.service");
let ConsentService = class ConsentService {
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async giveConsent(userId, consentType, ipAddress, userAgent) {
        const existingConsent = await this.prisma.consent.findFirst({
            where: {
                userId,
                type: consentType,
            },
            orderBy: { grantedAt: 'desc' },
        });
        if (existingConsent) {
            return existingConsent;
        }
        const consent = await this.prisma.consent.create({
            data: {
                userId,
                type: consentType,
                basis: 'consent',
                details: `IP: ${ipAddress}, UserAgent: ${userAgent}`,
            },
        });
        await this.auditService.createAuditLog(userId, 'CREATE', 'consent', consent.id, {
            consentType,
            action: 'given',
            ipAddress,
            userAgent,
        });
        return consent;
    }
    async getUserConsents(userId, requestingUserId, requestingUserRole) {
        if (requestingUserRole !== 'ADMIN' && requestingUserId !== userId) {
            throw new Error('Unauthorized');
        }
        return this.prisma.consent.findMany({
            where: { userId },
            orderBy: { grantedAt: 'desc' },
        });
    }
    async getAllConsents(requestingUserId, requestingUserRole, page = 1, limit = 10, consentType) {
        if (requestingUserRole !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        const skip = (page - 1) * limit;
        const where = {};
        if (consentType) {
            where.type = consentType;
        }
        const [consents, total] = await Promise.all([
            this.prisma.consent.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                orderBy: { grantedAt: 'desc' },
            }),
            this.prisma.consent.count({ where }),
        ]);
        return {
            data: consents,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getConsentStats(requestingUserId, requestingUserRole) {
        if (requestingUserRole !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        const stats = await this.prisma.consent.groupBy({
            by: ['type'],
            _count: { type: true },
        });
        return stats.map(stat => ({
            consentType: stat.type,
            count: stat._count.type,
        }));
    }
    async checkUserConsent(userId, consentType) {
        const consent = await this.prisma.consent.findFirst({
            where: {
                userId,
                type: consentType,
            },
        });
        return !!consent;
    }
};
exports.ConsentService = ConsentService;
exports.ConsentService = ConsentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ConsentService);
//# sourceMappingURL=consent.service.js.map