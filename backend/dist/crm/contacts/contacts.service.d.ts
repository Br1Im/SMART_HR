import { PrismaService } from '../../database/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createContactDto: CreateContactDto, userId: string, userRole: string): Promise<{
        organization: {
            id: string;
            name: string;
        };
    } & {
        email: string;
        fullName: string;
        role: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        orgId: string;
    }>;
    findAll(userId: string, userRole: string, page?: number, limit?: number, search?: string, orgId?: string): Promise<{
        data: ({
            organization: {
                id: string;
                name: string;
            };
        } & {
            email: string;
            fullName: string;
            role: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            orgId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string, userRole: string): Promise<{
        organization: {
            id: string;
            name: string;
            ownerId: string;
        };
    } & {
        email: string;
        fullName: string;
        role: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        orgId: string;
    }>;
    update(id: string, updateContactDto: UpdateContactDto, userId: string, userRole: string): Promise<{
        organization: {
            id: string;
            name: string;
        };
    } & {
        email: string;
        fullName: string;
        role: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        orgId: string;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
}
