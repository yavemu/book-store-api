import { IsOptional, IsPositive, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationInputDto {
  @ApiPropertyOptional({ type: Number, default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ type: Number, default: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ type: String, default: 'createdAt', required: false })
  @IsOptional()
  @Type(() => String)
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ type: String, default: 'DESC', required: false })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  // Getter para calcular offset (SIN decorador Swagger)
  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}