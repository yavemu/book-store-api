import { IsUUID, IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookAuthorAssignmentDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID of the book being assigned',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  bookId: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID of the author being assigned',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  authorId: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  @ApiPropertyOptional({
    description: 'Role of the author in this book (e.g., "Main Author", "Co-Author")',
    example: 'Main Author',
    maxLength: 100,
  })
  authorRole?: string;
}