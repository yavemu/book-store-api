import { BadRequestException } from '@nestjs/common';

/**
 * Utilidad para sanitizar y escapar valores de entrada para prevenir inyección SQL
 */
export class SqlSanitizer {
  
  /**
   * Lista de palabras clave SQL peligrosas que deben ser bloqueadas
   */
  private static readonly DANGEROUS_SQL_KEYWORDS = [
    'DROP', 'DELETE', 'TRUNCATE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE',
    'EXEC', 'EXECUTE', 'UNION', 'SELECT', '--', '/*', '*/', 'xp_',
    'sp_', 'SCRIPT', 'JAVASCRIPT', 'VBSCRIPT', 'ONLOAD', 'ONERROR',
    'SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT'
  ];

  /**
   * Patrones de expresiones regulares peligrosas
   */
  private static readonly DANGEROUS_PATTERNS = [
    /(\b(DROP|DELETE|TRUNCATE|UPDATE|INSERT|ALTER|CREATE|EXEC|EXECUTE)\s)/gi,
    /(\bUNION\s+SELECT\b)/gi,
    /(\bOR\s+1=1\b)/gi,
    /(\bAND\s+1=1\b)/gi,
    /(--|\/\*|\*\/)/g,
    /(\bxp_\w+)/gi,
    /(\bsp_\w+)/gi,
    /(<script|<iframe|<object|<embed)/gi,
    /(javascript:|vbscript:|onload=|onerror=)/gi,
    /(\x00|\x1a)/g // caracteres nulos
  ];

  /**
   * Sanitiza un término de búsqueda eliminando caracteres peligrosos
   * @param term - Término a sanitizar
   * @returns Término sanitizado
   */
  static sanitizeSearchTerm(term: string): string {
    if (!term || typeof term !== 'string') {
      return '';
    }

    // Eliminar espacios en blanco al inicio y final
    let sanitized = term.trim();

    // Verificar longitud mínima y máxima
    if (sanitized.length < 1) {
      return '';
    }
    
    if (sanitized.length > 500) {
      throw new BadRequestException('Search term too long (max 500 characters)');
    }

    // Verificar palabras clave peligrosas
    const upperTerm = sanitized.toUpperCase();
    for (const keyword of this.DANGEROUS_SQL_KEYWORDS) {
      if (upperTerm.includes(keyword)) {
        throw new BadRequestException(`Invalid search term: contains forbidden keyword "${keyword}"`);
      }
    }

    // Verificar patrones peligrosos
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(sanitized)) {
        throw new BadRequestException('Invalid search term: contains potentially dangerous pattern');
      }
    }

    // Escapar caracteres especiales SQL
    sanitized = sanitized
      .replace(/'/g, "''")  // escapar comillas simples
      .replace(/\\/g, '\\\\') // escapar backslashes
      .replace(/%/g, '\\%')   // escapar wildcards de LIKE
      .replace(/_/g, '\\_')   // escapar wildcards de LIKE
      .replace(/\[/g, '\\['); // escapar corchetes

    // Limitar a caracteres seguros (letras, números, espacios, algunos símbolos)
    sanitized = sanitized.replace(/[^\w\s\-\.\,\:\;\!\?\(\)\[\]]/g, '');

    return sanitized;
  }

  /**
   * Valida que un término de búsqueda sea seguro sin modificarlo
   * @param term - Término a validar
   * @returns true si es seguro, false si no
   */
  static isValidSearchTerm(term: string): boolean {
    try {
      const sanitized = this.sanitizeSearchTerm(term);
      return sanitized.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Sanitiza un valor para ser usado en filtros WHERE
   * @param value - Valor a sanitizar
   * @returns Valor sanitizado
   */
  static sanitizeFilterValue(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      return this.sanitizeSearchTerm(value);
    }

    if (typeof value === 'number') {
      // Validar que sea un número válido
      if (!Number.isFinite(value)) {
        throw new BadRequestException('Invalid numeric value');
      }
      return value;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (value instanceof Date) {
      return value;
    }

    // Para otros tipos, convertir a string y sanitizar
    return this.sanitizeSearchTerm(String(value));
  }

  /**
   * Sanitiza un objeto completo de filtros
   * @param filters - Objeto con filtros a sanitizar
   * @returns Objeto sanitizado
   */
  static sanitizeFilters(filters: Record<string, any>): Record<string, any> {
    const sanitizedFilters: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      // Validar que la clave sea segura (solo letras, números y guiones bajos)
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
        throw new BadRequestException(`Invalid filter key: ${key}`);
      }

      sanitizedFilters[key] = this.sanitizeFilterValue(value);
    }

    return sanitizedFilters;
  }

  /**
   * Valida y sanitiza parámetros de ordenamiento
   * @param sortBy - Campo por el que ordenar
   * @param sortOrder - Orden (ASC/DESC)
   * @returns Objeto con parámetros sanitizados
   */
  static sanitizeSortParams(sortBy?: string, sortOrder?: string): { sortBy: string; sortOrder: 'ASC' | 'DESC' } {
    // Campos permitidos para ordenamiento (whitelist)
    const allowedSortFields = [
      'id', 'createdAt', 'updatedAt', 'name', 'title', 'firstName', 'lastName',
      'email', 'username', 'price', 'stockQuantity', 'publicationDate', 'nationality'
    ];

    let safeSortBy = 'createdAt';
    if (sortBy && allowedSortFields.includes(sortBy)) {
      safeSortBy = sortBy;
    }

    let safeSortOrder: 'ASC' | 'DESC' = 'DESC';
    if (sortOrder && (sortOrder.toUpperCase() === 'ASC' || sortOrder.toUpperCase() === 'DESC')) {
      safeSortOrder = sortOrder.toUpperCase() as 'ASC' | 'DESC';
    }

    return { sortBy: safeSortBy, sortOrder: safeSortOrder };
  }

  /**
   * Sanitiza parámetros de paginación
   * @param page - Número de página
   * @param limit - Elementos por página
   * @returns Parámetros sanitizados
   */
  static sanitizePaginationParams(page?: number, limit?: number): { page: number; limit: number; offset: number } {
    const safePage = Math.max(1, Math.floor(page || 1));
    const safeLimit = Math.min(100, Math.max(1, Math.floor(limit || 10))); // máximo 100 elementos por página
    const offset = (safePage - 1) * safeLimit;

    return { page: safePage, limit: safeLimit, offset };
  }

  /**
   * Crea un mensaje de log para auditar intentos de inyección SQL
   * @param originalTerm - Término original
   * @param sanitizedTerm - Término sanitizado
   * @param userId - ID del usuario que hizo la petición
   * @returns Mensaje de log
   */
  static createSecurityLogMessage(originalTerm: string, sanitizedTerm: string, userId?: string): string {
    return `SQL Injection attempt detected. User: ${userId || 'anonymous'}, Original: "${originalTerm}", Sanitized: "${sanitizedTerm}"`;
  }
}