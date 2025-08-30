import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class BookCatalogResponseDto {
  @ApiProperty({
    description: 'ID único del libro',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Título del libro',
    example: 'The Shining',
  })
  title: string;

  @ApiProperty({
    description: 'Código ISBN único del libro',
    example: '9780307743657',
  })
  isbnCode: string;

  @ApiProperty({
    description: 'Precio del libro',
    example: 19.99,
  })
  price: number;

  @ApiProperty({
    description: 'Indica si el libro está disponible para compra',
    example: true,
  })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Cantidad disponible en stock',
    example: 25,
  })
  stockQuantity: number;

  @ApiPropertyOptional({
    description: 'URL de la imagen de portada del libro',
    example: 'https://example.com/covers/the-shining.jpg',
    required: false,
  })
  coverImageUrl?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'Fecha de publicación del libro',
    example: '1977-01-28T00:00:00.000Z',
    required: false,
  })
  publicationDate?: Date;

  @ApiPropertyOptional({
    description: 'Número de páginas del libro',
    example: 447,
    required: false,
  })
  pageCount?: number;

  @ApiPropertyOptional({
    description: 'Resumen o descripción del libro',
    example: 'Una novela de terror psicológico que cuenta la historia de Jack Torrance...',
    required: false,
  })
  summary?: string;

  @ApiProperty({
    description: 'ID del género del libro',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  genreId: string;

  @ApiProperty({
    description: 'ID de la editorial',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  publisherId: string;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2024-01-02T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class BookCatalogListResponseDto {
  @ApiProperty({
    description: 'Lista de libros',
    type: [BookCatalogResponseDto],
  })
  data: BookCatalogResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      total: 150,
      page: 1,
      limit: 10,
      totalPages: 15,
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
}

export class CreateBookCatalogResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Libro creado exitosamente en el catálogo',
  })
  message: string;

  @ApiProperty({
    description: 'Información del libro creado',
    type: BookCatalogResponseDto,
  })
  book: BookCatalogResponseDto;
}

export class UpdateBookCatalogResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Libro actualizado exitosamente en el catálogo',
  })
  message: string;

  @ApiProperty({
    description: 'Información del libro actualizado',
    type: BookCatalogResponseDto,
  })
  book: BookCatalogResponseDto;
}

export class DeleteBookCatalogResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Libro eliminado exitosamente del catálogo',
  })
  message: string;

  @ApiProperty({
    description: 'ID del libro eliminado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  deletedBookId: string;
}
