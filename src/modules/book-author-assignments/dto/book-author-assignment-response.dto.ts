import { ApiProperty } from '@nestjs/swagger';
import { BookCatalogResponseDto } from '../../book-catalog/dto';
import { BookAuthorResponseDto } from '../../book-authors/dto';

export class BookAuthorAssignmentResponseDto {
  @ApiProperty({
    description: "ID único de la asignación",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "ID del libro",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  bookId: string;

  @ApiProperty({
    description: "ID del autor",
    example: "550e8400-e29b-41d4-a716-446655440002",
  })
  authorId: string;

  @ApiProperty({
    description: "Fecha de creación de la asignación",
    example: "2024-01-01T00:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({ type: () => BookCatalogResponseDto })
  book: BookCatalogResponseDto;

  @ApiProperty({ type: () => BookAuthorResponseDto })
  author: BookAuthorResponseDto;
}
