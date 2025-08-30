export interface IImageValidationService {
  validateImageFile(file: Express.Multer.File): Promise<void>;
  isValidImageMimeType(mimetype: string): boolean;
  isValidImageExtension(filename: string): boolean;
}
