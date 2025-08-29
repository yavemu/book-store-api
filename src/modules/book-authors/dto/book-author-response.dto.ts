import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class BookAuthorResponseDto {
  @ApiProperty({
    description: "ID único del autor",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "Nombre del autor",
    example: "Stephen",
  })
  firstName: string;

  @ApiProperty({
    description: "Apellido del autor",
    example: "King",
  })
  lastName: string;

  @ApiPropertyOptional({
    description: "Nacionalidad del autor",
    example: "Estadounidense",
    required: false,
  })
  nationality?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: "Birth date of the author",
    example: "1947-10-21",
    format: "date",
    required: false,
  })
  birthDate?: Date;

  @ApiPropertyOptional({
    description: "Biografía del autor",
    example: "Stephen Edwin King es un escritor estadounidense de novelas de terror, ficción sobrenatural, suspenso, ciencia ficción y fantasía.",
    required: false,
  })
  biography?: string;

  @ApiProperty({
    description: "Fecha de creación del registro",
    example: "2024-01-01T00:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Fecha de última actualización del registro",
    example: "2024-01-02T00:00:00.000Z",
  })
  updatedAt: Date;
}

export class BookAuthorListResponseDto {
  @ApiProperty({ 
    description: 'Lista de autores', 
    type: [BookAuthorResponseDto] 
  })
  data: BookAuthorResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      total: 75,
      page: 1,
      limit: 10,
      totalPages: 8,
      hasNext: true,
      hasPrev: false
    }
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

export class CreateBookAuthorResponseDto {
  @ApiProperty({ 
    description: 'Mensaje de confirmación', 
    example: 'Autor creado exitosamente' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Información del autor creado',
    type: BookAuthorResponseDto
  })
  author: BookAuthorResponseDto;
}

export class UpdateBookAuthorResponseDto {
  @ApiProperty({ 
    description: 'Mensaje de confirmación', 
    example: 'Autor actualizado exitosamente' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Información del autor actualizado',
    type: BookAuthorResponseDto
  })
  author: BookAuthorResponseDto;
}

export class DeleteBookAuthorResponseDto {
  @ApiProperty({ 
    description: 'Mensaje de confirmación', 
    example: 'Autor eliminado exitosamente' 
  })
  message: string;

  @ApiProperty({ 
    description: 'ID del autor eliminado', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  deletedAuthorId: string;
}