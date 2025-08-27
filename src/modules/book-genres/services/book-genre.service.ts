import { Injectable, Inject } from '@nestjs/common';
import { IBookGenreRepository } from '../interfaces/book-genre.repository.interface';
import { IBookGenreService } from '../interfaces/book-genre.service.interface';
import { IAuditLogService } from '../../audit/interfaces';
import { BookGenre } from '../entities/book-genre.entity';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { AuditAction } from '../../audit/enums/audit-action.enum';

@Injectable()
export class BookGenreService implements IBookGenreService {
  constructor(
    @Inject('IBookGenreRepository')
    private readonly genreRepository: IBookGenreRepository,
    @Inject('IAuditLogService')
    private readonly auditService: IAuditLogService,
  ) {}

  async create(createBookGenreDto: CreateBookGenreDto, performedBy: string): Promise<BookGenre> {
    const genre = await this.genreRepository.registerGenre(createBookGenreDto);
    
    await this.auditService.log(
      performedBy,
      genre.id,
      AuditAction.CREATE,
      `Created book genre: ${genre.genreName}`,
      'BookGenre'
    );

    return genre;
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookGenre>> {
    return await this.genreRepository.getAllGenres(pagination);
  }

  async findById(id: string): Promise<BookGenre> {
    return await this.genreRepository.getGenreProfile(id);
  }

  async update(id: string, updateBookGenreDto: UpdateBookGenreDto, performedBy: string): Promise<BookGenre> {
    const genre = await this.genreRepository.updateGenreProfile(id, updateBookGenreDto);
    
    await this.auditService.log(
      performedBy,
      genre.id,
      AuditAction.UPDATE,
      `Updated book genre: ${genre.genreName}`,
      'BookGenre'
    );

    return genre;
  }

  async softDelete(id: string, performedBy: string): Promise<void> {
    const genre = await this.genreRepository.getGenreProfile(id);
    await this.genreRepository.deactivateGenre(id);
    
    await this.auditService.log(
      performedBy,
      id,
      AuditAction.DELETE,
      `Deleted book genre: ${genre.genreName}`,
      'BookGenre'
    );
  }

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>> {
    return await this.genreRepository.searchGenres(searchTerm, pagination);
  }
}