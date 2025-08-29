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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { IBookCatalogCrudService } from '../interfaces/book-catalog-crud.service.interface';
import { IBookCatalogSearchService } from '../interfaces/book-catalog-search.service.interface';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { BookFiltersDto } from "../dto/book-filters.dto";
import { CsvExportFiltersDto } from "../dto/csv-export-filters.dto";
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
  ApiCheckIsbn,
  ApiExportBooksCsv
} from '../decorators';
import { UserRole } from "../../../modules/users/enums";
import { Auth } from "../../../common/decorators/auth.decorator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

@ApiTags('Book Catalog')
@Controller('book-catalog')
export class BookCatalogController {
  constructor(
    @Inject('IBookCatalogCrudService')
    private readonly bookCatalogCrudService: IBookCatalogCrudService,
    @Inject('IBookCatalogSearchService')
    private readonly bookCatalogSearchService: IBookCatalogSearchService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateBook()
  create(
    @Body() createBookCatalogDto: CreateBookCatalogDto,
    @Request() req: any,
  ) {
    return this.bookCatalogCrudService.create(createBookCatalogDto, req.user.id);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBooks()
  findAll(@Query() pagination: PaginationDto) {
    return this.bookCatalogCrudService.findAll(pagination);
  }

  @Get('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchBooks()
  search(
    @Query('term') searchTerm: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookCatalogSearchService.search(searchTerm, pagination);
  }

  @Post('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterBooks()
  filter(
    @Body() filters: BookFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookCatalogSearchService.findWithFilters(filters, pagination);
  }

  @Get('available')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAvailableBooks()
  findAvailable(@Query() pagination: PaginationDto) {
    return this.bookCatalogSearchService.findAvailableBooks(pagination);
  }

  @Get('by-genre/:genreId')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBooksByGenre()
  findByGenre(
    @Param('genreId') genreId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookCatalogSearchService.findByGenre(genreId, pagination);
  }

  @Get('by-publisher/:publisherId')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBooksByPublisher()
  findByPublisher(
    @Param('publisherId') publisherId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookCatalogSearchService.findByPublisher(publisherId, pagination);
  }

  @Get('check-isbn/:isbn')
  @Auth(UserRole.ADMIN)
  @ApiCheckIsbn()
  async checkIsbn(@Param('isbn') isbn: string) {
    return this.bookCatalogSearchService.checkIsbnExists(isbn);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiExportBooksCsv()
  async exportToCsv(
    @Query() filters: CsvExportFiltersDto,
    @Res() res: Response,
  ) {
    const csvData = await this.bookCatalogSearchService.exportToCsv(filters);
    
    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `catalogo-libros-${currentDate}.csv`;
    
    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Add BOM for UTF-8 to ensure proper encoding in Excel
    const csvWithBom = '\uFEFF' + csvData;
    
    return res.send(csvWithBom);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBookById()
  findOne(@Param('id') id: string) {
    return this.bookCatalogCrudService.findById(id);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateBook()
  update(
    @Param('id') id: string,
    @Body() updateBookCatalogDto: UpdateBookCatalogDto,
    @Request() req: any,
  ) {
    return this.bookCatalogCrudService.update(id, updateBookCatalogDto, req.user.id);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteBook()
  remove(@Param('id') id: string, @Request() req: any) {
    return this.bookCatalogCrudService.softDelete(id, req.user.id);
  }
}