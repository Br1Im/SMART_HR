import { CreateContactDto } from './create-contact.dto';
declare const UpdateContactDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateContactDto, "orgId">>>;
export declare class UpdateContactDto extends UpdateContactDto_base {
}
export {};
