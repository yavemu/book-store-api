import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class BookAuthorIdParamDto {
  @ApiProperty({
    description: 'ID único del autor',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID del autor debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del autor es requerido' })
  id: string;
}
