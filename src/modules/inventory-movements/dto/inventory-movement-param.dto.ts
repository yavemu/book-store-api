import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class InventoryMovementIdParamDto {
  @ApiProperty({
    description: 'ID único del movimiento de inventario',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID del movimiento de inventario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del movimiento de inventario es requerido' })
  id: string;
}
