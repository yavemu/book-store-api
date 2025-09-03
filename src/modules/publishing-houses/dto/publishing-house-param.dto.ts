import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class PublishingHouseIdParamDto {
  @ApiProperty({
    description: 'ID único de la editorial',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID de la editorial debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la editorial es requerido' })
  id: string;
}
