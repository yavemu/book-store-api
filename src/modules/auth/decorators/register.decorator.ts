import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { RegisterResponseDto } from '../dto';
import { BadRequestResponseDto, ConflictResponseDto } from '../../../common/dto';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar nuevo usuario - Acceso: Público',
      description:
        'Crea una nueva cuenta de usuario en el sistema con validación de datos y encriptación de contraseña.',
    }),
    ApiResponse({
      status: 201,
      description: 'Usuario registrado exitosamente',
      type: RegisterResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos',
      type: BadRequestResponseDto,
    }),
    ApiConflictResponse({
      description: 'Conflicto en registro - El email o nombre de usuario ya están registrados',
      type: ConflictResponseDto,
    }),
  );
}
