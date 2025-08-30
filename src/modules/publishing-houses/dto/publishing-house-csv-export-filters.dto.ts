import { IsOptional, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PublishingHouseCsvExportFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by publishing house name',
    type: String,
    example: 'Penguin',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by country',
    type: String,
    example: 'United States',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Filter by website URL',
    type: String,
    example: 'penguin.com',
  })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Start date for publishing houses created date range',
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for publishing houses created date range',
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  endDate?: string;
}
