import { ConsentService } from './consent.service';
declare class GiveConsentDto {
    consentType: string;
}
export declare class ConsentController {
    private readonly consentService;
    constructor(consentService: ConsentService);
    giveConsent(giveConsentDto: GiveConsentDto, req: any, ip: string, userAgent: string): Promise<{
        id: string;
        details: string | null;
        userId: string;
        type: import(".prisma/client").$Enums.ConsentType;
        grantedAt: Date;
        basis: string;
    }>;
    getUserConsents(req: any): Promise<{
        id: string;
        details: string | null;
        userId: string;
        type: import(".prisma/client").$Enums.ConsentType;
        grantedAt: Date;
        basis: string;
    }[]>;
    getSpecificUserConsents(userId: string, req: any): Promise<{
        id: string;
        details: string | null;
        userId: string;
        type: import(".prisma/client").$Enums.ConsentType;
        grantedAt: Date;
        basis: string;
    }[]>;
    getAllConsents(req: any, page?: string, limit?: string, consentType?: string): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
            };
        } & {
            id: string;
            details: string | null;
            userId: string;
            type: import(".prisma/client").$Enums.ConsentType;
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
    getConsentStats(req: any): Promise<{
        consentType: import(".prisma/client").$Enums.ConsentType;
        count: number;
    }[]>;
    checkConsent(consentType: string, req: any): Promise<boolean>;
}
export {};
