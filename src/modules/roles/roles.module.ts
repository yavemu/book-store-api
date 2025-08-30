import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesController } from './controllers/roles.controller';
import { RoleCrudService } from './services/role-crud.service';
import { RoleSearchService } from './services/role-search.service';
import { ValidationService } from './services/validation.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { UserContextService } from './services/user-context.service';
import { RoleRepository } from './repositories/role.repository';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), AuditModule],
  controllers: [RolesController],
  providers: [
    // Core Services
    RoleCrudService,
    RoleSearchService,
    ValidationService,
    ErrorHandlerService,
    UserContextService,
    RoleRepository,

    // Interface Providers
    {
      provide: 'IRoleCrudService',
      useClass: RoleCrudService,
    },
    {
      provide: 'IRoleSearchService',
      useClass: RoleSearchService,
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
      provide: 'IRoleCrudRepository',
      useClass: RoleRepository,
    },
    {
      provide: 'IRoleSearchRepository',
      useClass: RoleRepository,
    },
    {
      provide: 'IRoleValidationRepository',
      useClass: RoleRepository,
    },
  ],
  exports: [TypeOrmModule, RoleCrudService, RoleSearchService, RoleRepository],
})
export class RolesModule {}
