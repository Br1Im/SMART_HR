import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    create(createOrganizationDto: CreateOrganizationDto, req: any): Promise<{
        _count: {
            contacts: number;
        };
        contacts: {
            email: string;
            fullName: string;
            id: string;
        }[];
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
    findAll(req: any, page?: string, limit?: string, search?: string): Promise<{
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
    findOne(id: string, req: any): Promise<{
        contacts: {
            email: string;
            fullName: string;
            id: string;
            createdAt: Date;
            phone: string;
        }[];
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
    update(id: string, updateOrganizationDto: UpdateOrganizationDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
