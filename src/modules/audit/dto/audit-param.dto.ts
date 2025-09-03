import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class AuditIdParamDto {
  @ApiProperty({
    description: 'ID único del registro de auditoría',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID del registro de auditoría debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del registro de auditoría es requerido' })
  id: string;
}
