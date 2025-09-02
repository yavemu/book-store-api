import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookCatalogResponseDto } from '../../book-catalog/dto';
import { BookAuthorResponseDto } from '../../book-authors/dto';

export class BookAuthorAssignmentResponseDto {
  @ApiProperty({
    description: 'ID único de la asignación',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del libro',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  bookId: string;

  @ApiProperty({
    description: 'ID del autor',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  authorId: string;

  @ApiProperty({
    description: 'Fecha de creación de la asignación',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización de la asignación',
    example: '2024-01-02T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => BookCatalogResponseDto })
  book?: BookCatalogResponseDto;

  @ApiPropertyOptional({ type: () => BookAuthorResponseDto })
  author?: BookAuthorResponseDto;
}

export class BookAuthorAssignmentListResponseDto {
  @ApiProperty({
    description: 'Lista de asignaciones libro-autor',
    type: [BookAuthorAssignmentResponseDto],
  })
  data: BookAuthorAssignmentResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      total: 45,
      page: 1,
      limit: 10,
      totalPages: 5,
      hasNext: true,
      hasPrev: false,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Asignaciones obtenidas exitosamente',
  })
  message: string;
}

export class CreateBookAuthorAssignmentResponseDto {
  @ApiProperty({
    description: 'Información de la asignación creada',
    type: BookAuthorAssignmentResponseDto,
  })
  data: BookAuthorAssignmentResponseDto;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Asignación libro-autor creada exitosamente',
  })
  message: string;
}

export class UpdateBookAuthorAssignmentResponseDto {
  @ApiProperty({
    description: 'Información de la asignación actualizada',
    type: BookAuthorAssignmentResponseDto,
  })
  data: BookAuthorAssignmentResponseDto;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Asignación libro-autor actualizada exitosamente',
  })
  message: string;
}

export class DeleteBookAuthorAssignmentResponseDto {
  @ApiProperty({
    description: 'ID de la asignación eliminada',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  data: string;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Asignación libro-autor eliminada exitosamente',
  })
  message: string;
}
