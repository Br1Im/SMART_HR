import { PrismaService } from '../../database/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOrganizationDto: CreateOrganizationDto, userId: string): Promise<{
        _count: {
            contacts: number;
        };
        owner: {
            email: string;
            fullName: string;
            id: string;
        };
        contacts: {
            email: string;
            fullName: string;
            id: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        inn: string;
        site: string | null;
        status: string;
        ownerId: string;
    }>;
    findAll(userId: string, userRole: string, page?: number, limit?: number, search?: string): Promise<{
        data: ({
            _count: {
                contacts: number;
            };
            owner: {
                email: string;
                fullName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            inn: string;
            site: string | null;
            status: string;
            ownerId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string, userRole: string): Promise<{
        owner: {
            email: string;
            fullName: string;
            id: string;
        };
        contacts: {
            email: string;
            fullName: string;
            id: string;
            createdAt: Date;
            phone: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        inn: string;
        site: string | null;
        status: string;
        ownerId: string;
    }>;
    update(id: string, updateOrganizationDto: UpdateOrganizationDto, userId: string, userRole: string): Promise<{
        _count: {
            contacts: number;
        };
        owner: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        inn: string;
        site: string | null;
        status: string;
        ownerId: string;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
}
