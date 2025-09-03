import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { IImageValidationService } from '../interfaces';

@Injectable()
export class ImageValidationService implements IImageValidationService {
  private readonly logger = new Logger(ImageValidationService.name);

  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  private readonly ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  async validateImageFile(file: Express.Multer.File): Promise<void> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      this.validateFileSize(file);
      this.validateMimeType(file);
      this.validateFileExtension(file);

      this.logger.log(`Image validation successful for file: ${file.originalname}`);
    } catch (error) {
      this.logger.error(`Image validation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  isValidImageMimeType(mimetype: string): boolean {
    return this.ALLOWED_MIME_TYPES.includes(mimetype.toLowerCase());
  }

  isValidImageExtension(filename: string): boolean {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return this.ALLOWED_EXTENSIONS.includes(extension);
  }

  private validateFileSize(file: Express.Multer.File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`,
      );
    }
  }

  private validateMimeType(file: Express.Multer.File): void {
    if (!this.isValidImageMimeType(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }
  }

  private validateFileExtension(file: Express.Multer.File): void {
    if (!this.isValidImageExtension(file.originalname)) {
      throw new BadRequestException(
        `Invalid file extension. Allowed extensions: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
      );
    }
  }
}
