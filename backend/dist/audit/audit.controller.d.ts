import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getAuditLogs(req: any, page?: string, limit?: string, entity?: string, action?: string, startDate?: string, endDate?: string): Promise<{
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
    getAuditStats(req: any): Promise<{
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
    getAuditLog(id: string, req: any): Promise<{
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
}
