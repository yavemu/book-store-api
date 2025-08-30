import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublishingHouseResponseDto {
  @ApiProperty({
    description: 'ID único de la editorial',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la editorial',
    example: 'Penguin Random House',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'País donde se ubica la editorial',
    example: 'Estados Unidos',
    required: false,
  })
  country?: string;

  @ApiPropertyOptional({
    description: 'URL del sitio web oficial de la editorial',
    example: 'https://www.penguinrandomhouse.com',
    required: false,
  })
  websiteUrl?: string;

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

export class PublishingHouseListResponseDto {
  @ApiProperty({
    description: 'Lista de editoriales',
    type: [PublishingHouseResponseDto],
  })
  data: PublishingHouseResponseDto[];

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
}

export class CreatePublishingHouseResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Editorial creada exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Información de la editorial creada',
    type: PublishingHouseResponseDto,
  })
  publisher: PublishingHouseResponseDto;
}

export class UpdatePublishingHouseResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Editorial actualizada exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Información de la editorial actualizada',
    type: PublishingHouseResponseDto,
  })
  publisher: PublishingHouseResponseDto;
}

export class DeletePublishingHouseResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Editorial eliminada exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'ID de la editorial eliminada',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  deletedPublisherId: string;
}
