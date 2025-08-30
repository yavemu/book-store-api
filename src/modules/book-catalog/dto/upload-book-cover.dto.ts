import { ApiProperty } from '@nestjs/swagger';

export class UploadBookCoverDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Book cover image file (JPEG, PNG, WebP, GIF - max 5MB)',
    example: 'cover-image.jpg',
  })
  coverImage: Express.Multer.File;
}
