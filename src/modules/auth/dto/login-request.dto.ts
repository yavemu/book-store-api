import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LoginDto } from './login.dto';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Datos de autenticación del usuario',
    type: LoginDto,
  })
  @ValidateNested()
  @Type(() => LoginDto)
  loginData: LoginDto;
}
