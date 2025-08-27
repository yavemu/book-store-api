import { IsString, IsNotEmpty, Length, IsOptional, IsNumber, IsBoolean, IsUUID, IsDateString, Min, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class CreateBookCatalogDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    description: "Title of the book",
    example: "The Shining",
    minLength: 1,
    maxLength: 255,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 13)
  @ApiProperty({
    description: "Unique ISBN code for the book",
    example: "9780307743657",
    minLength: 10,
    maxLength: 13,
  })
  isbnCode: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    description: "Price of the book",
    example: 19.99,
    minimum: 0,
    type: "number",
    format: "decimal",
  })
  price: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional({
    description: "Indicates if the book is available for purchase",
    example: true,
    default: true,
  })
  isAvailable?: boolean = true;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: "Available stock quantity of the book",
    example: 25,
    minimum: 0,
    default: 0,
  })
  stockQuantity?: number = 0;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: "URL of the book cover image",
    example: "https://example.com/covers/the-shining.jpg",
    format: "url",
  })
  coverImageUrl?: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @ApiPropertyOptional({
    description: "Date when the book was published",
    example: "1977-01-28",
    format: "date",
  })
  publicationDate?: Date;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: "Number of pages in the book",
    example: 447,
    minimum: 1,
  })
  pageCount?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: "Summary or description of the book",
    example:
      "A psychological horror novel that tells the story of Jack Torrance, an aspiring writer and recovering alcoholic who accepts a position as the off-season caretaker of the isolated historic Overlook Hotel.",
  })
  summary?: string;

  @IsUUID()
  @ApiProperty({
    description: "Foreign key reference to book genre",
    example: "550e8400-e29b-41d4-a716-446655440000",
    format: "uuid",
  })
  genreId: string;

  @IsUUID()
  @ApiProperty({
    description: "Foreign key reference to publishing house",
    example: "550e8400-e29b-41d4-a716-446655440001",
    format: "uuid",
  })
  publisherId: string;
}