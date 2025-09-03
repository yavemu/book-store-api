import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class CreateUserRequestDto {
  @ApiProperty({
    description: 'Datos de creación del usuario',
    type: CreateUserDto,
  })
  @ValidateNested()
  @Type(() => CreateUserDto)
  userData: CreateUserDto;
}
