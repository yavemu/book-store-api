import { Injectable } from '@nestjs/common';
import { IValidationService } from '../interfaces';

@Injectable()
export class ValidationService implements IValidationService {
  async validateUniqueConstraints<T>(
    dto: Partial<T>,
    entityId?: string,
    constraints?: Array<{
      field: string | string[];
      message: string;
      transform?: (value: any) => any;
    }>,
    repository?: any,
  ): Promise<void> {
    if (!constraints || !repository) {
      return;
    }

    if (repository && repository._validateUniqueConstraints) {
      await repository._validateUniqueConstraints(dto, entityId, constraints);
    }
  }
}
