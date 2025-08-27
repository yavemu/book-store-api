import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublishingHouse } from './entities/publishing-house.entity';
import { PublishingHousesController } from './publishing-houses.controller';
import { PublishingHouseService } from './services/publishing-house.service';
import { PublishingHouseRepository } from './repositories/publishing-house.repository';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublishingHouse]),
    AuditModule,
  ],
  controllers: [PublishingHousesController],
  providers: [
    {
      provide: 'IPublishingHouseService',
      useClass: PublishingHouseService,
    },
    {
      provide: 'IPublishingHouseRepository',
      useClass: PublishingHouseRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    'IPublishingHouseService',
    'IPublishingHouseRepository',
  ],
})
export class PublishingHousesModule {}