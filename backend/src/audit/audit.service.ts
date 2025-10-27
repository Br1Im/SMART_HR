import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async createAuditLog(
    userId: string,
    action: string,
    entity: string,
    entityId?: string,
    details?: any,
  ) {
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
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw error to avoid breaking the main operation
      return null;
    }
  }

  async getAuditLogs(
    userId: string,
    userRole: string,
    page: number = 1,
    limit: number = 10,
    entity?: string,
    action?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const skip = (page - 1) * limit;
    
    let whereClause: any = {};

    // Role-based access control
    if (userRole === 'CLIENT') {
      // Clients can only see their own audit logs
      whereClause.userId = userId;
    } else if (userRole === 'MANAGER') {
      // For MANAGER role, only show their own audit logs
      whereClause.userId = userId;
    }
    // Admins can see all logs (no additional filter)

    // Apply filters
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

  async getAuditLogById(id: string, userId: string, userRole: string) {
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

    // Role-based access control
    if (userRole === 'CLIENT' && log.userId !== userId) {
      throw new Error('Access denied');
    }

    if (userRole === 'MANAGER' && log.userId !== userId) {
      throw new Error('Access denied');
    }

    return log;
  }

  async getAuditStats(userId: string, userRole: string) {
    let whereClause: any = {};

    // Role-based access control
    if (userRole === 'CLIENT') {
      whereClause.userId = userId;
    } else if (userRole === 'MANAGER') {
      // For MANAGER role, only show their own audit logs
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
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
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
}