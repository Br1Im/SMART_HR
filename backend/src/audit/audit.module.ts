import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { ConsentService } from './consent.service';
import { ConsentController } from './consent.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AuditController, ConsentController],
  providers: [AuditService, ConsentService],
  exports: [AuditService, ConsentService],
})
export class AuditModule {}