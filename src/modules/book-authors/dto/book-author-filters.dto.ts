import { IsOptional, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BookAuthorFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by first name',
    type: String,
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Filter by last name',
    type: String,
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Filter by nationality',
    type: String,
    example: 'American',
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({
    description: 'Filter authors created after this date',
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  createdAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter authors created before this date',
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  createdBefore?: string;

  @ApiPropertyOptional({
    description: 'Filter by email',
    type: String,
    example: 'author@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter by biography',
    type: String,
    example: 'Famous writer',
  })
  @IsOptional()
  @IsString()
  biography?: string;
}
