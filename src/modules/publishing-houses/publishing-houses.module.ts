import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublishingHouse } from './entities/publishing-house.entity';
import { PublishingHouseCrudRepository } from './repositories/publishing-house-crud.repository';
import { PublishingHouseSearchRepository } from './repositories/publishing-house-search.repository';
import { PublishingHouseCrudService } from './services/publishing-house-crud.service';
import { PublishingHouseSearchService } from './services/publishing-house-search.service';
import { PublishingHouseService } from './services/publishing-house.service';
import { ValidationService } from './services/validation.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { UserContextService } from './services/user-context.service';
import { PublishingHousesController } from './controllers/publishing-houses.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublishingHouse]),
    AuditModule,
  ],
  controllers: [PublishingHousesController],
  providers: [
    // Core Services
    PublishingHouseCrudService,
    PublishingHouseSearchService,
    PublishingHouseService,
    ValidationService,
    ErrorHandlerService,
    UserContextService,
    PublishingHouseCrudRepository,
    PublishingHouseSearchRepository,
    
    // Interface Providers
    {
      provide: 'IPublishingHouseService',
      useClass: PublishingHouseService,
    },
    {
      provide: 'IPublishingHouseCrudService',
      useClass: PublishingHouseCrudService,
    },
    {
      provide: 'IPublishingHouseSearchService',
      useClass: PublishingHouseSearchService,
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
      provide: 'IPublishingHouseCrudRepository',
      useClass: PublishingHouseCrudRepository,
    },
    {
      provide: 'IPublishingHouseSearchRepository',
      useClass: PublishingHouseSearchRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    'IPublishingHouseCrudService',
    'IPublishingHouseSearchService',
  ],
})
export class PublishingHousesModule {}