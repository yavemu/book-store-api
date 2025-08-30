import { IsOptional, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BookGenreFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by genre name',
    type: String,
    example: 'Fiction',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by description content',
    type: String,
    example: 'narrative',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter genres created after this date',
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  createdAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter genres created before this date',
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  createdBefore?: string;
}
