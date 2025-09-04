import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';

export class RegisterUserRequestDto {
  @ApiProperty({
    description: 'User registration data',
    type: RegisterUserDto,
  })
  @ValidateNested()
  @Type(() => RegisterUserDto)
  registrationData: RegisterUserDto;
}