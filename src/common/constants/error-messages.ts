export const ERROR_MESSAGES = {
  // Autenticación
  AUTH: {
    INVALID_CREDENTIALS: "Credenciales inválidas",
    USER_NOT_FOUND: "Usuario no encontrado en la solicitud",
    TOKEN_EXPIRED: "Token expirado",
    UNAUTHORIZED: "No autorizado",
    FORBIDDEN: "Acceso denegado",
  },

  // Usuarios
  USERS: {
    NOT_FOUND: "Usuario no encontrado",
    ALREADY_EXISTS: "El usuario ya existe",
    USERNAME_EXISTS: "El nombre de usuario ya está en uso",
    EMAIL_EXISTS: "El email ya está registrado",
    INVALID_PASSWORD: "Contraseña inválida",
    FAILED_TO_CREATE: "Error al crear el usuario",
    FAILED_TO_UPDATE: "Error al actualizar el usuario",
    FAILED_TO_DELETE: "Error al eliminar el usuario",
    FAILED_TO_GET_PROFILE: "Error al obtener el perfil del usuario",
    FAILED_TO_GET_ALL: "Error al obtener todos los usuarios",
  },

  // Roles
  ROLES: {
    NOT_FOUND: "Rol no encontrado",
    ALREADY_EXISTS: "El rol ya existe",
    FAILED_TO_CREATE: "Error al crear el rol",
    FAILED_TO_UPDATE: "Error al actualizar el rol",
    FAILED_TO_DELETE: "Error al eliminar el rol",
    FAILED_TO_GET_ALL: "Error al obtener todos los roles",
  },

  // Auditoría
  AUDIT: {
    FAILED_TO_LOG: "Error al registrar la acción del usuario",
    FAILED_TO_GET_TRAIL: "Error al obtener el registro de auditoría",
    FAILED_TO_GET_HISTORY: "Error al obtener el historial de auditoría",
    FAILED_TO_SEARCH: "Error al buscar en los logs de auditoría",
  },

  // Géneros de libros
  BOOK_GENRES: {
    NOT_FOUND: "Género de libro no encontrado",
    ALREADY_EXISTS: "El género de libro ya existe",
    FAILED_TO_CREATE: "Error al crear el género de libro",
    FAILED_TO_UPDATE: "Error al actualizar el género de libro",
    FAILED_TO_DELETE: "Error al eliminar el género de libro",
    FAILED_TO_GET_ALL: "Error al obtener todos los géneros de libros",
  },

  // Editoriales
  PUBLISHING_HOUSES: {
    NOT_FOUND: "Editorial no encontrada",
    ALREADY_EXISTS: "La editorial ya existe",
    FAILED_TO_CREATE: "Error al crear la editorial",
    FAILED_TO_UPDATE: "Error al actualizar la editorial",
    FAILED_TO_DELETE: "Error al eliminar la editorial",
    FAILED_TO_GET_ALL: "Error al obtener todas las editoriales",
  },

  // Autores
  BOOK_AUTHORS: {
    NOT_FOUND: "Autor no encontrado",
    ALREADY_EXISTS: "El autor ya existe",
    FAILED_TO_CREATE: "Error al crear el autor",
    FAILED_TO_UPDATE: "Error al actualizar el autor",
    FAILED_TO_DELETE: "Error al eliminar el autor",
    FAILED_TO_GET_ALL: "Error al obtener todos los autores",
  },

  // Catálogo de libros
  BOOK_CATALOG: {
    NOT_FOUND: "Libro no encontrado",
    ALREADY_EXISTS: "El libro ya existe",
    FAILED_TO_CREATE: "Error al crear el libro",
    FAILED_TO_UPDATE: "Error al actualizar el libro",
    FAILED_TO_DELETE: "Error al eliminar el libro",
    FAILED_TO_GET_ALL: "Error al obtener todos los libros",
    INVALID_ISBN: "ISBN inválido",
    INVALID_FILTERS: "Filtros de búsqueda inválidos",
  },

  // Asignaciones autor-libro
  BOOK_AUTHOR_ASSIGNMENTS: {
    NOT_FOUND: "Asignación autor-libro no encontrada",
    ALREADY_EXISTS: "La asignación autor-libro ya existe",
    FAILED_TO_CREATE: "Error al crear la asignación autor-libro",
    FAILED_TO_UPDATE: "Error al actualizar la asignación autor-libro",
    FAILED_TO_DELETE: "Error al eliminar la asignación autor-libro",
    FAILED_TO_GET_ALL: "Error al obtener todas las asignaciones autor-libro",
  },

  // Validaciones generales
  VALIDATION: {
    REQUIRED_FIELD: "Este campo es requerido",
    INVALID_FORMAT: "Formato inválido",
    INVALID_EMAIL: "Email inválido",
    INVALID_UUID: "UUID inválido",
    MIN_LENGTH: "Longitud mínima requerida",
    MAX_LENGTH: "Longitud máxima excedida",
    POSITIVE_NUMBER: "Debe ser un número positivo",
    INVALID_DATE: "Fecha inválida",
    INVALID_ENUM: "Valor no válido para este campo",
  },

  // Errores de base de datos
  DATABASE: {
    CONNECTION_ERROR: "Error de conexión a la base de datos",
    QUERY_ERROR: "Error en la consulta a la base de datos",
    TRANSACTION_ERROR: "Error en la transacción de base de datos",
    UNIQUE_CONSTRAINT: "Ya existe un registro con estos datos únicos",
    FOREIGN_KEY_CONSTRAINT: "Error de referencia en la base de datos",
  },

  // Errores generales
  GENERAL: {
    INTERNAL_SERVER_ERROR: "Error interno del servidor",
    BAD_REQUEST: "Solicitud incorrecta",
    NOT_FOUND: "Recurso no encontrado",
    CONFLICT: "Conflicto en la operación",
    UNPROCESSABLE_ENTITY: "Entidad no procesable",
  },
};

/**
 * Obtener mensaje de error con parámetros dinámicos
 */
export function getErrorMessage(key: string, params?: Record<string, string>): string {
  let message = key;

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(`{${param}}`, value);
    });
  }

  return message;
}
