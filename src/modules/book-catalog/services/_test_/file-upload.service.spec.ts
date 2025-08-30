import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { FileUploadService } from '../file-upload.service';
import { ImageValidationService } from '../image-validation.service';

jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    access: jest.fn(),
    unlink: jest.fn(),
  },
}));

describe('FileUploadService', () => {
  let service: FileUploadService;
  let imageValidationService: ImageValidationService;

  const mockFile: Express.Multer.File = {
    fieldname: 'coverImage',
    originalname: 'test-image.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('fake-image-data'),
    size: 1024,
    destination: '',
    filename: '',
    path: '',
    stream: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: 'IImageValidationService',
          useValue: {
            validateImageFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
    imageValidationService = module.get('IImageValidationService');

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('uploadBookCover', () => {
    it('should upload book cover successfully', async () => {
      const bookTitle = 'The Great Gatsby';
      const expectedFilename = 'the_great_gatsby.cover_image.jpg';
      const expectedUrl = `/uploads/books/${expectedFilename}`;

      (imageValidationService.validateImageFile as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await service.uploadBookCover(mockFile, bookTitle);

      expect(imageValidationService.validateImageFile).toHaveBeenCalledWith(mockFile);
      expect(fs.writeFile).toHaveBeenCalledWith(
        join(process.cwd(), 'uploads', 'books', expectedFilename),
        mockFile.buffer,
      );
      expect(result).toBe(expectedUrl);
    });

    it('should sanitize filename correctly', async () => {
      const bookTitle = 'Book with Special Characters! @#$%';
      const expectedFilename = 'book_with_special_characters.cover_image.jpg';

      (imageValidationService.validateImageFile as jest.Mock).mockResolvedValue(undefined);
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await service.uploadBookCover(mockFile, bookTitle);

      expect(fs.writeFile).toHaveBeenCalledWith(
        join(process.cwd(), 'uploads', 'books', expectedFilename),
        mockFile.buffer,
      );
      expect(result).toBe(`/uploads/books/${expectedFilename}`);
    });

    it('should throw error if image validation fails', async () => {
      const error = new BadRequestException('Invalid file type');
      (imageValidationService.validateImageFile as jest.Mock).mockRejectedValue(error);

      await expect(service.uploadBookCover(mockFile, 'Test Book')).rejects.toThrow(error);
      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should throw error if file write fails', async () => {
      const error = new Error('Write failed');
      (imageValidationService.validateImageFile as jest.Mock).mockResolvedValue(undefined);
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockRejectedValue(error);

      await expect(service.uploadBookCover(mockFile, 'Test Book')).rejects.toThrow(error);
    });
  });

  describe('deleteBookCover', () => {
    it('should delete book cover successfully', async () => {
      const imagePath = '/uploads/books/test_book.cover_image.jpg';
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      await service.deleteBookCover(imagePath);

      expect(fs.access).toHaveBeenCalledWith(
        join(process.cwd(), 'uploads', 'books', 'test_book.cover_image.jpg'),
      );
      expect(fs.unlink).toHaveBeenCalledWith(
        join(process.cwd(), 'uploads', 'books', 'test_book.cover_image.jpg'),
      );
    });

    it('should handle file not found gracefully', async () => {
      const imagePath = '/uploads/books/nonexistent.jpg';
      const error = new Error('File not found');
      (error as any).code = 'ENOENT';
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.unlink as jest.Mock).mockRejectedValue(error);

      await expect(service.deleteBookCover(imagePath)).resolves.not.toThrow();
      expect(fs.unlink).toHaveBeenCalled();
    });

    it('should do nothing if imagePath is empty', async () => {
      await service.deleteBookCover('');
      await service.deleteBookCover(null);
      await service.deleteBookCover(undefined);

      expect(fs.access).not.toHaveBeenCalled();
      expect(fs.unlink).not.toHaveBeenCalled();
    });

    it('should throw error for other file system errors', async () => {
      const imagePath = '/uploads/books/test.jpg';
      const error = new Error('Permission denied');
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.unlink as jest.Mock).mockRejectedValue(error);

      await expect(service.deleteBookCover(imagePath)).rejects.toThrow(error);
    });
  });

  describe('generateImageUrl', () => {
    it('should generate correct image URL', () => {
      const filename = 'test_image.jpg';
      const result = service.generateImageUrl(filename);
      expect(result).toBe('/uploads/books/test_image.jpg');
    });
  });

  describe('extractFilenameFromUrl', () => {
    it('should extract filename from valid URL', () => {
      const url = '/uploads/books/test_image.jpg';
      const result = (service as any).extractFilenameFromUrl(url);
      expect(result).toBe('test_image.jpg');
    });

    it('should return null for invalid URL', () => {
      const url = '/invalid/path/image.jpg';
      const result = (service as any).extractFilenameFromUrl(url);
      expect(result).toBeNull();
    });
  });

  describe('sanitizeFilename', () => {
    it('should sanitize filename correctly', () => {
      const testCases = [
        { input: 'Normal Title', expected: 'normal_title' },
        { input: 'Title with Spaces', expected: 'title_with_spaces' },
        { input: 'Special!@#$%Characters', expected: 'special_characters' },
        { input: 'Multiple___Underscores', expected: 'multiple_underscores' },
        { input: '_Leading_and_Trailing_', expected: 'leading_and_trailing' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = (service as any).sanitizeFilename(input);
        expect(result).toBe(expected);
      });
    });
  });
});
