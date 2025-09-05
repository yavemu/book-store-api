import { IsString, IsOptional, IsUrl, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PublishingHouseExactSearchDto {
  @IsString()
  @IsOptional()
  @Length(2, 100)
  @ApiPropertyOptional({
    description: 'Name of the publishing house',
    example: 'Penguin Random House',
    minLength: 2,
    maxLength: 100,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  @ApiPropertyOptional({
    description: 'Country where the publishing house is located',
    example: 'United States',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  country?: string;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Official website URL of the publishing house',
    example: 'https://www.penguinrandomhouse.com',
    format: 'url',
    required: false,
  })
  websiteUrl?: string;
}
