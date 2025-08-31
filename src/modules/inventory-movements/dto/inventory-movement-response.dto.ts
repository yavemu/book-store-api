import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '../enums/movement-type.enum';
import { MovementStatus } from '../enums/movement-status.enum';
import { UserRole } from '../../../common/enums/user-role.enum';

export class InventoryMovementResponseDto {
  @ApiProperty({
    description: 'ID único de la movimiento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Tipo de entidad afectada',
    example: 'book',
  })
  entityType: string;

  @ApiProperty({
    description: 'ID de la entidad afectada',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  entityId: string;

  @ApiProperty({
    description: 'ID del usuario que realizó la acción',
    example: '789e1234-e89b-12d3-a456-426614174002',
  })
  userId: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez García',
  })
  userFullName: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: UserRole.ADMIN,
  })
  userRole: string;

  @ApiProperty({
    description: 'Valor del precio antes del cambio',
    example: 25000.0,
    required: false,
  })
  priceBefore?: number;

  @ApiProperty({
    description: 'Valor del precio después del cambio',
    example: 27000.0,
    required: false,
  })
  priceAfter?: number;

  @ApiProperty({
    description: 'Cantidad antes del cambio',
    example: 50,
    required: false,
  })
  quantityBefore?: number;

  @ApiProperty({
    description: 'Cantidad después del cambio',
    example: 45,
    required: false,
  })
  quantityAfter?: number;

  @ApiProperty({
    description: 'Tipo de movimiento',
    enum: MovementType,
    example: MovementType.PURCHASE,
  })
  movementType: MovementType;

  @ApiProperty({
    description: 'Estado de la movimiento',
    enum: MovementStatus,
    example: MovementStatus.COMPLETED,
  })
  status: MovementStatus;

  @ApiProperty({
    description: 'Notas adicionales o descripción del error',
    example: 'Actualización completada exitosamente',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T11:45:00Z',
  })
  updatedAt: Date;
}
