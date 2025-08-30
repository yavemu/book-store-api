import { IsOptional, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PublishingHouseFiltersDto {
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
    description: 'Filter publishing houses created after this date',
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  createdAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter publishing houses created before this date',
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  createdBefore?: string;

  @ApiPropertyOptional({
    description: 'Filter publishing houses updated after this date',
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  updatedAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter publishing houses updated before this date',
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  updatedBefore?: string;
}
