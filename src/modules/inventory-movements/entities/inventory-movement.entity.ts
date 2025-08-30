import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '../enums/movement-type.enum';
import { MovementStatus } from '../enums/movement-status.enum';

@Entity('inventory_movements')
export class InventoryMovement {
  @ApiProperty({
    description: 'ID único del movimiento de inventario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Tipo de entidad afectada',
    example: 'book',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Tipo de entidad afectada (book, etc.)',
  })
  entityType: string;

  @ApiProperty({
    description: 'ID de la entidad afectada',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @Column({
    type: 'uuid',
    nullable: false,
    comment: 'ID de la entidad afectada',
  })
  entityId: string;

  @ApiProperty({
    description: 'ID del usuario que realizó la acción',
    example: '789e1234-e89b-12d3-a456-426614174002',
  })
  @Column({
    type: 'uuid',
    nullable: false,
    comment: 'ID del usuario que realizó la acción',
  })
  userId: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez García',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Nombre completo del usuario',
  })
  userFullName: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 'ADMIN',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Rol del usuario',
  })
  userRole: string;

  @ApiProperty({
    description: 'Valor del precio antes del cambio',
    example: 25000.0,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Valor del precio antes del cambio',
  })
  priceBefore: number;

  @ApiProperty({
    description: 'Valor del precio después del cambio',
    example: 27000.0,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Valor del precio después del cambio',
  })
  priceAfter: number;

  @ApiProperty({
    description: 'Cantidad antes del cambio',
    example: 50,
  })
  @Column({
    type: 'integer',
    nullable: true,
    comment: 'Cantidad antes del cambio',
  })
  quantityBefore: number;

  @ApiProperty({
    description: 'Cantidad después del cambio',
    example: 45,
  })
  @Column({
    type: 'integer',
    nullable: true,
    comment: 'Cantidad después del cambio',
  })
  quantityAfter: number;

  @ApiProperty({
    description: 'Tipo de movimiento',
    enum: MovementType,
    example: MovementType.PURCHASE,
  })
  @Column({
    type: 'enum',
    enum: MovementType,
    nullable: false,
    comment: 'Tipo de movimiento (PURCHASE, SALE, DISCOUNT, INCREASE, OUT_OF_STOCK, ARCHIVED)',
  })
  movementType: MovementType;

  @ApiProperty({
    description: 'Estado del movimiento',
    enum: MovementStatus,
    example: MovementStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: MovementStatus,
    default: MovementStatus.PENDING,
    nullable: false,
    comment: 'Estado del movimiento (PENDING, COMPLETED, ERROR)',
  })
  status: MovementStatus;

  @ApiProperty({
    description: 'Notas adicionales o descripción del error',
    example: 'Actualización completada exitosamente',
  })
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Notas adicionales o descripción del error',
  })
  notes: string;

  @ApiProperty({
    description: 'Indica si el registro está activo',
    example: true,
  })
  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
    comment: 'Indica si el registro está activo (soft delete)',
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creación del registro',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T11:45:00Z',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Fecha de última actualización del registro',
  })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    // Validaciones antes de insertar
    this.validateRequiredFields();
  }

  @BeforeUpdate()
  beforeUpdate() {
    // Validaciones antes de actualizar
    this.validateRequiredFields();
  }

  private validateRequiredFields() {
    if (!this.entityType || this.entityType.trim() === '') {
      throw new Error('Entity type is required');
    }
    if (!this.entityId) {
      throw new Error('Entity ID is required');
    }
    if (!this.userId) {
      throw new Error('User ID is required');
    }
    if (!this.userFullName || this.userFullName.trim() === '') {
      throw new Error('User full name is required');
    }
    if (!this.userRole || this.userRole.trim() === '') {
      throw new Error('User role is required');
    }
    if (!this.movementType) {
      throw new Error('Movement type is required');
    }
  }
}
