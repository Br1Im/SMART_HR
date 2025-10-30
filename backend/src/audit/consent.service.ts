import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from './audit.service';
import { ConsentType } from '@prisma/client';

@Injectable()
export class ConsentService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async giveConsent(
    userId: string,
    consentType: ConsentType,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // Check if consent already exists
    const existingConsent = await this.prisma.consent.findFirst({
      where: {
        userId,
        type: consentType,
      },
      orderBy: { grantedAt: 'desc' },
    });

    // If consent already given, return existing
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

    // Create audit log
    await this.auditService.createAuditLog(
      userId,
      'CREATE',
      'consent',
      consent.id,
      {
        consentType,
        action: 'given',
        ipAddress,
        userAgent,
      },
    );

    return consent;
  }

  async getUserConsents(userId: string, requestingUserId: string, requestingUserRole: string) {
    // Only allow users to see their own consents or admins to see any
    if (requestingUserRole !== 'ADMIN' && requestingUserId !== userId) {
      throw new Error('Unauthorized');
    }

    return this.prisma.consent.findMany({
      where: { userId },
      orderBy: { grantedAt: 'desc' },
    });
  }

  async getAllConsents(
    requestingUserId: string,
    requestingUserRole: string,
    page: number = 1,
    limit: number = 10,
    consentType?: ConsentType,
  ) {
    // Only admins can see all consents
    if (requestingUserRole !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const skip = (page - 1) * limit;
    const where: any = {};

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

  async getConsentStats(requestingUserId: string, requestingUserRole: string) {
    // Only admins can see consent stats
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

  async checkUserConsent(userId: string, consentType: ConsentType): Promise<boolean> {
    const consent = await this.prisma.consent.findFirst({
      where: {
        userId,
        type: consentType,
      },
    });

    return !!consent;
  }
}