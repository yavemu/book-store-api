import { IsOptional, IsString, IsUUID, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BookFiltersDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ 
    description: 'Search term for book title',
    example: 'Harry Potter'
  })
  title?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ 
    description: 'Filter by genre ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  genreId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ 
    description: 'Filter by publisher ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid'
  })
  publisherId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiPropertyOptional({ 
    description: 'Filter by availability status',
    example: true
  })
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({ 
    description: 'Minimum price filter',
    example: 10.00,
    minimum: 0
  })
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({ 
    description: 'Maximum price filter',
    example: 50.00,
    minimum: 0
  })
  maxPrice?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ 
    description: 'Search term for author name',
    example: 'J.K. Rowling'
  })
  author?: string;
}