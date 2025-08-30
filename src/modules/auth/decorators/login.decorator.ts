import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from '../dto';
import { BadRequestResponseDto, UnauthorizedResponseDto } from '../../../common/dto';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Iniciar sesión de usuario - Acceso: Público',
      description:
        'Autentica al usuario con credenciales y devuelve un token JWT para acceso a endpoints protegidos.',
    }),
    ApiBody({
      type: LoginDto,
    }),
    ApiResponse({
      status: 200,
      description: 'Inicio de sesión exitoso',
      type: LoginResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Credenciales inválidas - Email no registrado o contraseña incorrecta',
      type: UnauthorizedResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos',
      type: BadRequestResponseDto,
    }),
  );
}
