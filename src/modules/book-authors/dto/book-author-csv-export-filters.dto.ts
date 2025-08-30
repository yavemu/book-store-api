import { IsOptional, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BookAuthorCsvExportFiltersDto {
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
    description: 'Start date for authors created date range',
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for authors created date range',
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  endDate?: string;
}
