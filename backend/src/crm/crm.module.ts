import { Module } from '@nestjs/common';
import { OrganizationsModule } from './organizations/organizations.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [OrganizationsModule, ContactsModule],
  exports: [OrganizationsModule, ContactsModule],
})
export class CrmModule {}