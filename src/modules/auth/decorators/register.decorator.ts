import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse, 
  ApiConflictResponse 
} from '@nestjs/swagger';
import { RegisterResponseDto } from '../dto';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Registrar nuevo usuario - Acceso: Público',
      description: 'Crea una nueva cuenta de usuario en el sistema' 
    }),
    ApiResponse({ 
      status: 201, 
      description: 'Usuario registrado exitosamente',
      type: RegisterResponseDto
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { 
            type: 'array', 
            items: { type: 'string' },
            example: [
              'El nombre de usuario debe tener al menos 3 caracteres',
              'Debe proporcionar un email válido',
              'La contraseña debe tener al menos 6 caracteres'
            ]
          },
          error: { type: 'string', example: 'Bad Request' }
        }
      }
    }),
    ApiConflictResponse({
      description: 'Usuario ya existe',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: { type: 'string', example: 'El nombre de usuario ya está en uso' },
          error: { type: 'string', example: 'Conflict' }
        }
      }
    })
  );
}