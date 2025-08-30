export interface IFileUploadService {
  uploadBookCover(file: Express.Multer.File, bookTitle: string): Promise<string>;
  deleteBookCover(imagePath: string): Promise<void>;
  generateImageUrl(filename: string): string;
}
