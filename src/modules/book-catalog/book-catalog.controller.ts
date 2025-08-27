import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IBookCatalogService } from './interfaces/book-catalog.service.interface';
import { CreateBookCatalogDto } from './dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from './dto/update-book-catalog.dto';
import { BookFiltersDto } from './dto/book-filters.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { BookCatalog } from './entities/book-catalog.entity';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import {
  ApiCreateBook,
  ApiGetBooks,
  ApiGetBookById,
  ApiUpdateBook,
  ApiDeleteBook,
  ApiSearchBooks,
  ApiFilterBooks,
  ApiGetAvailableBooks,
  ApiGetBooksByGenre,
  ApiGetBooksByPublisher,
  ApiCheckIsbn
} from './decorators';

@ApiTags('Book Catalog')
@Controller('book-catalog')
export class BookCatalogController {
  constructor(
    @Inject('IBookCatalogService')
    private readonly bookCatalogService: IBookCatalogService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateBook()
  create(
    @Body() createBookCatalogDto: CreateBookCatalogDto,
    @Request() req: any,
  ) {
    return this.bookCatalogService.create(createBookCatalogDto, req.user.id);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBooks()
  findAll(@Query() pagination: PaginationDto) {
    return this.bookCatalogService.findAll(pagination);
  }

  @Get('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchBooks()
  search(
    @Query('term') searchTerm: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookCatalogService.search(searchTerm, pagination);
  }

  @Post('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterBooks()
  filter(
    @Body() filters: BookFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookCatalogService.findWithFilters(filters, pagination);
  }

  @Get('available')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAvailableBooks()
  findAvailable(@Query() pagination: PaginationDto) {
    return this.bookCatalogService.findAvailableBooks(pagination);
  }

  @Get('by-genre/:genreId')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBooksByGenre()
  findByGenre(
    @Param('genreId') genreId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookCatalogService.findByGenre(genreId, pagination);
  }

  @Get('by-publisher/:publisherId')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBooksByPublisher()
  findByPublisher(
    @Param('publisherId') publisherId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookCatalogService.findByPublisher(publisherId, pagination);
  }

  @Get('check-isbn/:isbn')
  @Auth(UserRole.ADMIN)
  @ApiCheckIsbn()
  async checkIsbn(@Param('isbn') isbn: string) {
    return this.bookCatalogService.checkIsbnExists(isbn);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBookById()
  findOne(@Param('id') id: string) {
    return this.bookCatalogService.findById(id);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateBook()
  update(
    @Param('id') id: string,
    @Body() updateBookCatalogDto: UpdateBookCatalogDto,
    @Request() req: any,
  ) {
    return this.bookCatalogService.update(id, updateBookCatalogDto, req.user.id);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteBook()
  remove(@Param('id') id: string, @Request() req: any) {
    return this.bookCatalogService.softDelete(id, req.user.id);
  }
}