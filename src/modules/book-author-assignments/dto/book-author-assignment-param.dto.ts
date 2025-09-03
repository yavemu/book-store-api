import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class BookAuthorAssignmentIdParamDto {
  @ApiProperty({
    description: 'ID único de la asignación libro-autor',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID de la asignación debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la asignación es requerido' })
  id: string;
}
