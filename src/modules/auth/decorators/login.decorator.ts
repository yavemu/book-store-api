import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiBody } from "@nestjs/swagger";
import { LoginDto, LoginResponseDto } from "../dto";

const INPUT_DATA = {
  email: "john@example.com",
  password: "Password123!",
};

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: "Iniciar sesión de usuario - Acceso: Público",
      description: "Autentica al usuario con credenciales y devuelve un token JWT",
    }),
    ApiBody({
      type: LoginDto,
      examples: {
        "application/json": {
          value: INPUT_DATA,
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: "Inicio de sesión exitoso",
      type: LoginResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: "Credenciales inválidas",
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: 401 },
          message: { type: "string", example: "Credenciales inválidas" },
          timestamp: { type: "string", example: "2024-01-01T00:00:00.000Z" },
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Datos de entrada inválidos",
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: 400 },
          message: {
            type: "array",
            items: { type: "string" },
            example: ["El nombre de usuario es requerido", "La contraseña es requerida"],
          },
          error: { type: "string", example: "Bad Request" },
        },
      },
    }),
  );
}
