import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RegisterUserDto } from '../../users/dto/register-user.dto';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'Datos de registro del usuario',
    type: RegisterUserDto,
  })
  @ValidateNested()
  @Type(() => RegisterUserDto)
  registrationData: RegisterUserDto;
}
