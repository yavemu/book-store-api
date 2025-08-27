import { IsString, IsNotEmpty, Length, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateBookAuthorDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @ApiProperty({
    description: "First name of the author",
    example: "Stephen",
    minLength: 1,
    maxLength: 50,
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @ApiProperty({
    description: "Last name of the author",
    example: "King",
    minLength: 1,
    maxLength: 50,
  })
  lastName: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  @ApiPropertyOptional({
    description: "Nationality of the author",
    example: "American",
    minLength: 2,
    maxLength: 50,
  })
  nationality?: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @ApiPropertyOptional({
    description: "Birth date of the author",
    example: "1947-09-21",
    format: "date",
  })
  birthDate?: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: "Biography or description of the author",
    example: "Stephen Edwin King is an American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.",
  })
  biography?: string;
}