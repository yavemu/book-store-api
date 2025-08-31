import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditSearchRepository } from './repositories/audit-search.repository';
import { AuditLoggerRepository } from './repositories/audit-logger.repository';
import { AuditSearchService } from './services/audit-search.service';
import { AuditLoggerService } from './services/audit-logger.service';
import { ValidationService } from './services/validation.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { UserContextService } from './services/user-context.service';
import { AuditController } from './controllers/audit.controller';
import { FileExportService } from '../../common/services/file-export.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditController],
  providers: [
    // Core Services
    AuditSearchService,
    AuditLoggerService,
    ValidationService,
    ErrorHandlerService,
    UserContextService,
    AuditSearchRepository,
    AuditLoggerRepository,
    FileExportService,

    // Interface Providers
    {
      provide: 'IAuditSearchService',
      useClass: AuditSearchService,
    },
    {
      provide: 'IAuditLoggerService',
      useClass: AuditLoggerService,
    },
    {
      provide: 'IValidationService',
      useClass: ValidationService,
    },
    {
      provide: 'IErrorHandlerService',
      useClass: ErrorHandlerService,
    },
    {
      provide: 'IUserContextService',
      useClass: UserContextService,
    },
    {
      provide: 'IAuditSearchRepository',
      useClass: AuditSearchRepository,
    },
    {
      provide: 'IAuditLoggerRepository',
      useClass: AuditLoggerRepository,
    },
  ],
  exports: ['IAuditSearchService', 'IAuditLoggerService'],
})
export class AuditModule {}
