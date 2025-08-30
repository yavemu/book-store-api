import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ImageValidationService } from '../image-validation.service';

describe('ImageValidationService', () => {
  let service: ImageValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageValidationService],
    }).compile();

    service = module.get<ImageValidationService>(ImageValidationService);
  });

  describe('validateImageFile', () => {
    const createMockFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File => ({
      fieldname: 'coverImage',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024 * 1024, // 1MB
      buffer: Buffer.from('fake-image-data'),
      destination: '',
      filename: '',
      path: '',
      stream: null,
      ...overrides,
    });

    it('should validate valid image file', async () => {
      const file = createMockFile();
      await expect(service.validateImageFile(file)).resolves.not.toThrow();
    });

    it('should throw error if no file provided', async () => {
      await expect(service.validateImageFile(null)).rejects.toThrow(
        new BadRequestException('No file provided'),
      );
    });

    it('should throw error for oversized file', async () => {
      const file = createMockFile({ size: 6 * 1024 * 1024 }); // 6MB
      await expect(service.validateImageFile(file)).rejects.toThrow(
        new BadRequestException('File size exceeds maximum allowed size of 5MB'),
      );
    });

    it('should throw error for invalid MIME type', async () => {
      const file = createMockFile({ mimetype: 'text/plain' });
      await expect(service.validateImageFile(file)).rejects.toThrow(
        new BadRequestException(
          'Invalid file type. Allowed types: image/jpeg, image/jpg, image/png, image/webp, image/gif',
        ),
      );
    });

    it('should throw error for invalid file extension', async () => {
      const file = createMockFile({ originalname: 'test.txt' });
      await expect(service.validateImageFile(file)).rejects.toThrow(
        new BadRequestException(
          'Invalid file extension. Allowed extensions: .jpg, .jpeg, .png, .webp, .gif',
        ),
      );
    });

    it('should validate all supported MIME types', async () => {
      const supportedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
      ];

      for (const mimetype of supportedMimeTypes) {
        const file = createMockFile({ mimetype, originalname: `test.${mimetype.split('/')[1]}` });
        await expect(service.validateImageFile(file)).resolves.not.toThrow();
      }
    });

    it('should validate all supported file extensions', async () => {
      const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

      for (const ext of supportedExtensions) {
        const file = createMockFile({
          originalname: `test${ext}`,
          mimetype: ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : `image/${ext.substring(1)}`,
        });
        await expect(service.validateImageFile(file)).resolves.not.toThrow();
      }
    });
  });

  describe('isValidImageMimeType', () => {
    it('should return true for valid MIME types', () => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

      validTypes.forEach((type) => {
        expect(service.isValidImageMimeType(type)).toBe(true);
        expect(service.isValidImageMimeType(type.toUpperCase())).toBe(true);
      });
    });

    it('should return false for invalid MIME types', () => {
      const invalidTypes = ['text/plain', 'application/pdf', 'image/bmp', 'image/tiff'];

      invalidTypes.forEach((type) => {
        expect(service.isValidImageMimeType(type)).toBe(false);
      });
    });
  });

  describe('isValidImageExtension', () => {
    it('should return true for valid extensions', () => {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

      validExtensions.forEach((ext) => {
        expect(service.isValidImageExtension(`test${ext}`)).toBe(true);
        expect(service.isValidImageExtension(`test${ext.toUpperCase()}`)).toBe(true);
      });
    });

    it('should return false for invalid extensions', () => {
      const invalidExtensions = ['.txt', '.pdf', '.doc', '.bmp', '.tiff'];

      invalidExtensions.forEach((ext) => {
        expect(service.isValidImageExtension(`test${ext}`)).toBe(false);
      });
    });

    it('should handle filenames without extensions', () => {
      expect(service.isValidImageExtension('filename_without_extension')).toBe(false);
    });

    it('should handle multiple dots in filename', () => {
      expect(service.isValidImageExtension('file.name.with.multiple.dots.jpg')).toBe(true);
      expect(service.isValidImageExtension('file.name.with.multiple.dots.txt')).toBe(false);
    });
  });
});
