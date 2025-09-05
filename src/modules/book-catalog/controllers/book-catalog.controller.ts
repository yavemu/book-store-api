import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Inject,
  Request,
  Res,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IBookCatalogCrudService } from '../interfaces/book-catalog-crud.service.interface';
import { IBookCatalogSearchService } from '../interfaces/book-catalog-search.service.interface';
import { IFileUploadService } from '../interfaces/file-upload.service.interface';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { BookExactSearchDto } from '../dto/book-exact-search.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
import { BookSimpleFilterDto } from '../dto/book-simple-filter.dto';
import { UploadBookCoverDto } from '../dto/upload-book-cover.dto';
import {
  ApiCreateBook,
  ApiGetBooks,
  ApiGetBookById,
  ApiUpdateBook,
  ApiDeleteBook,
  ApiSearchBooks,
  ApiFilterBooks,
  ApiExportBooksCsv,
  ApiUploadBookCover,
  ApiRemoveBookCover,
  ApiAdvancedFilterBooks,
  ApiExactSearchBooks,
  ApiSimpleFilterBooks,
  ApiListSelectBookCatalog,
} from '../decorators';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Auth } from '../../../common/decorators/auth.decorator';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@ApiTags('Book Catalog')
@Controller('book-catalog')
export class BookCatalogController {
  constructor(
    @Inject('IBookCatalogCrudService')
    private readonly bookCatalogCrudService: IBookCatalogCrudService,
    @Inject('IBookCatalogSearchService')
    private readonly bookCatalogSearchService: IBookCatalogSearchService,
    @Inject('IFileUploadService')
    private readonly fileUploadService: IFileUploadService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateBook()
  create(@Body() createBookCatalogDto: CreateBookCatalogDto, @Request() req: any) {
    return this.bookCatalogCrudService.create(createBookCatalogDto, req);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBooks()
  findAll(@Query() pagination: PaginationInputDto) {
    return this.bookCatalogCrudService.findAll(pagination);
  }

  @Get('list-select')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiListSelectBookCatalog()
  findForSelect() {
    return this.bookCatalogCrudService.findForSelect();
  }

  @Post('search')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiExactSearchBooks()
  exactSearch(@Body() searchDto: BookExactSearchDto, @Query() pagination: PaginationInputDto) {
    const paginationDto: PaginationDto = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      sortBy: pagination.sortBy || 'createdAt',
      sortOrder: pagination.sortOrder || 'DESC',
      offset: pagination.offset,
    };
    return this.bookCatalogSearchService.exactSearch(searchDto, paginationDto);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSimpleFilterBooks()
  filter(@Query() filterDto: BookSimpleFilterDto) {
    const pagination = new PaginationDto();
    pagination.page = filterDto.page;
    pagination.limit = filterDto.limit;
    pagination.sortBy = filterDto.sortBy;
    pagination.sortOrder = filterDto.sortOrder;
    return this.bookCatalogSearchService.simpleFilter(filterDto.term, pagination);
  }

  @Post('advanced-filter')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiAdvancedFilterBooks()
  advancedFilter(@Body() filters: BookFiltersDto, @Query() pagination: PaginationInputDto) {
    return this.bookCatalogSearchService.advancedFilter(filters, pagination);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiExportBooksCsv()
  async exportToCsv(@Query() filters: CsvExportFiltersDto, @Res() res: Response) {
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

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateBook()
  update(
    @Param('id') id: string,
    @Body() updateBookCatalogDto: UpdateBookCatalogDto,
    @Request() req: any,
  ) {
    return this.bookCatalogCrudService.update(id, updateBookCatalogDto, req);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteBook()
  remove(@Param('id') id: string, @Request() req: any) {
    return this.bookCatalogCrudService.softDelete(id, req.user.id);
  }

  @Post(':id/upload-cover')
  @Auth(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('coverImage'))
  @ApiUploadBookCover()
  async uploadBookCover(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    const book = await this.bookCatalogCrudService.findById(id);

    if (book.coverImageUrl) {
      await this.fileUploadService.deleteBookCover(book.coverImageUrl);
    }

    const coverImageUrl = await this.fileUploadService.uploadBookCover(file, book.title);

    const updateDto: UpdateBookCatalogDto = { coverImageUrl };
    return this.bookCatalogCrudService.update(id, updateDto, req.user.id);
  }

  @Delete(':id/cover')
  @Auth(UserRole.ADMIN)
  @ApiRemoveBookCover()
  async removeBookCover(@Param('id') id: string, @Request() req: any) {
    const book = await this.bookCatalogCrudService.findById(id);

    if (book.coverImageUrl) {
      await this.fileUploadService.deleteBookCover(book.coverImageUrl);

      const updateDto: UpdateBookCatalogDto = { coverImageUrl: null };
      return this.bookCatalogCrudService.update(id, updateDto, req.user.id);
    }

    return { message: 'No cover image to remove' };
  }
}
