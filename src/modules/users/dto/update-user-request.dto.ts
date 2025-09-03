import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from './update-user.dto';

export class UpdateUserRequestDto {
  @ApiProperty({
    description: 'ID único del usuario a actualizar',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  id: string;

  @ApiProperty({
    description: 'Datos de actualización del usuario',
    type: UpdateUserDto,
  })
  @ValidateNested()
  @Type(() => UpdateUserDto)
  updateData: UpdateUserDto;
}
