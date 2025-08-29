export interface IValidationService {
  validateUniqueConstraints<T>(
    dto: Partial<T>,
    entityId?: string,
    constraints?: Array<{
      field: string | string[];
      message: string;
      transform?: (value: any) => any;
    }>,
    repository?: any
  ): Promise<void>;
}