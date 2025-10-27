import { PrismaService } from '../database/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    createAuditLog(userId: string, action: string, entity: string, entityId?: string, details?: any): Promise<{
        id: string;
        action: string;
        entity: string;
        entityId: string;
        details: string | null;
        timestamp: Date;
        userId: string;
    }>;
    getAuditLogs(userId: string, userRole: string, page?: number, limit?: number, entity?: string, action?: string, startDate?: Date, endDate?: Date): Promise<{
        data: ({
            user: {
                email: string;
                fullName: string;
                role: string;
                id: string;
            };
        } & {
            id: string;
            action: string;
            entity: string;
            entityId: string;
            details: string | null;
            timestamp: Date;
            userId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getAuditLogById(id: string, userId: string, userRole: string): Promise<{
        user: {
            email: string;
            fullName: string;
            role: string;
            id: string;
        };
    } & {
        id: string;
        action: string;
        entity: string;
        entityId: string;
        details: string | null;
        timestamp: Date;
        userId: string;
    }>;
    getAuditStats(userId: string, userRole: string): Promise<{
        totalLogs: number;
        actionStats: {
            action: string;
            count: number;
        }[];
        entityStats: {
            entity: string;
            count: number;
        }[];
        recentActivity: ({
            user: {
                email: string;
                fullName: string;
                id: string;
            };
        } & {
            id: string;
            action: string;
            entity: string;
            entityId: string;
            details: string | null;
            timestamp: Date;
            userId: string;
        })[];
    }>;
}
