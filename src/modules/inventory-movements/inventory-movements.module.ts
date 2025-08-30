import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryMovementsController } from './inventory-movements.controller';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { InventoryMovementCrudService } from './services/inventory-movement-crud.service';
import { InventoryMovementCrudRepository } from './repositories/inventory-movement-crud.repository';
import { InventoryMovementTrackerService } from './services/inventory-movement-tracker.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovement]), AuditModule],
  controllers: [InventoryMovementsController],
  providers: [
    InventoryMovementCrudService,
    {
      provide: 'IInventoryMovementCrudService',
      useClass: InventoryMovementCrudService,
    },
    InventoryMovementCrudRepository,
    {
      provide: 'IInventoryMovementCrudRepository',
      useClass: InventoryMovementCrudRepository,
    },
    InventoryMovementTrackerService,
    {
      provide: 'IInventoryMovementTrackerService',
      useClass: InventoryMovementTrackerService,
    },
  ],
  exports: [
    'IInventoryMovementCrudService',
    'IInventoryMovementTrackerService',
    InventoryMovementTrackerService,
  ],
})
export class InventoryMovementsModule {}
