import { IsOptional, IsUUID, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssignmentFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by book ID',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  bookId?: string;

  @ApiPropertyOptional({
    description: 'Filter by author ID',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiPropertyOptional({
    description: 'Filter assignments created after this date',
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  createdAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter assignments created before this date',
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  createdBefore?: string;
}
