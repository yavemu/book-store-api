import { IsOptional, IsString, IsUUID, IsBoolean, IsNumber, Min, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CsvExportFiltersDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ 
    description: 'Search term for book title',
    example: 'Harry Potter',
    required: false,
  })
  title?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ 
    description: 'Filter by genre ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    required: false,
  })
  genreId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ 
    description: 'Filter by publisher ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
    required: false,
  })
  publisherId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiPropertyOptional({ 
    description: 'Filter by availability status',
    example: true,
    required: false,
  })
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({ 
    description: 'Minimum price filter',
    example: 10.00,
    minimum: 0,
    required: false,
  })
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({ 
    description: 'Maximum price filter',
    example: 50.00,
    minimum: 0,
    required: false,
  })
  maxPrice?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ 
    description: 'Search term for author name',
    example: 'J.K. Rowling',
    required: false,
  })
  author?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ 
    description: 'Start date for publication date range filter',
    example: '2020-01-01',
    format: 'date',
    required: false,
  })
  publicationDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ 
    description: 'End date for publication date range filter',
    example: '2023-12-31',
    format: 'date',
    required: false,
  })
  publicationDateTo?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ 
    description: 'Start date for creation date range filter',
    example: '2023-01-01',
    format: 'date',
    required: false,
  })
  createdDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ 
    description: 'End date for creation date range filter',
    example: '2023-12-31',
    format: 'date',
    required: false,
  })
  createdDateTo?: string;
}