import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class BookGenreIdParamDto {
  @ApiProperty({
    description: 'ID único del género literario',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID del género debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del género es requerido' })
  id: string;
}
