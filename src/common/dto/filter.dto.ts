import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InputPaginationDto } from './pagination.dto';

export class FilterWithTermDto extends InputPaginationDto {
  @ApiPropertyOptional({ 
    type: String, 
    description: 'Search term for filtering',
    example: 'search text'
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  term?: string;
}