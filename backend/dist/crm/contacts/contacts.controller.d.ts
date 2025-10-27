import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    create(createContactDto: CreateContactDto, req: any): Promise<{
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
    findAll(req: any, page?: string, limit?: string, search?: string, orgId?: string): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateContactDto: UpdateContactDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
