import { PrismaService } from '../database/prisma.service';
import { AuditService } from './audit.service';
export declare class ConsentService {
    private prisma;
    private auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    giveConsent(userId: string, consentType: string, ipAddress?: string, userAgent?: string): Promise<{
        id: string;
        details: string | null;
        userId: string;
        type: string;
        grantedAt: Date;
        basis: string;
    }>;
    getUserConsents(userId: string, requestingUserId: string, requestingUserRole: string): Promise<{
        id: string;
        details: string | null;
        userId: string;
        type: string;
        grantedAt: Date;
        basis: string;
    }[]>;
    getAllConsents(requestingUserId: string, requestingUserRole: string, page?: number, limit?: number, consentType?: string): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
            };
        } & {
            id: string;
            details: string | null;
            userId: string;
            type: string;
            grantedAt: Date;
            basis: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getConsentStats(requestingUserId: string, requestingUserRole: string): Promise<{
        consentType: string;
        count: number;
    }[]>;
    checkUserConsent(userId: string, consentType: string): Promise<boolean>;
}
