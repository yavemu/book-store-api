import { Injectable, Inject, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { IFileUploadService } from '../interfaces/file-upload.service.interface';
import { IImageValidationService } from '../interfaces/image-validation.service.interface';

@Injectable()
export class FileUploadService implements IFileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly uploadPath = join(process.cwd(), 'uploads', 'books');

  constructor(
    @Inject('IImageValidationService')
    private readonly imageValidationService: IImageValidationService,
  ) {
    this.ensureUploadDirectory();
  }

  async uploadBookCover(file: Express.Multer.File, bookTitle: string): Promise<string> {
    try {
      await this.imageValidationService.validateImageFile(file);

      const fileExtension = extname(file.originalname);
      const sanitizedTitle = this.sanitizeFilename(bookTitle);
      const filename = `${sanitizedTitle}.cover_image${fileExtension}`;
      const filePath = join(this.uploadPath, filename);

      await fs.writeFile(filePath, file.buffer);

      this.logger.log(`Book cover uploaded successfully: ${filename}`);
      return this.generateImageUrl(filename);
    } catch (error) {
      this.logger.error(`Failed to upload book cover: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteBookCover(imagePath: string): Promise<void> {
    try {
      if (!imagePath) return;

      const filename = this.extractFilenameFromUrl(imagePath);
      if (!filename) return;

      const filePath = join(this.uploadPath, filename);

      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        this.logger.log(`Book cover deleted successfully: ${filename}`);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
        this.logger.warn(`File not found during deletion: ${filename}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete book cover: ${error.message}`, error.stack);
      throw error;
    }
  }

  generateImageUrl(filename: string): string {
    return `/uploads/books/${filename}`;
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch (error) {
      this.logger.error(`Failed to create upload directory: ${error.message}`, error.stack);
      throw error;
    }
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  private extractFilenameFromUrl(url: string): string | null {
    const match = url.match(/\/uploads\/books\/(.+)$/);
    return match ? match[1] : null;
  }
}
