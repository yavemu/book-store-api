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
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IBookCatalogCrudService } from '../interfaces';
import { IBookCatalogSearchService } from '../interfaces';
import { IFileUploadService } from '../interfaces';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { BookExactSearchDto } from '../dto/book-exact-search.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
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
} from '../decorators';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Auth } from '../../../common/decorators/auth.decorator';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import {
  GetByIdParamDto,
  UpdateByIdParamDto,
  SoftDeleteParamDto,
} from '../../../common/dto/operation-param.dto';
import { FilterTermQueryDto } from '../../../common/dto/operation-query.dto';

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
  async create(
    @Body() createBookCatalogDto: CreateBookCatalogDto,
    @Request() req: any,
  ): Promise<any> {
    return this.bookCatalogCrudService.create(createBookCatalogDto, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBooks()
  async getAll(@Query() pagination: PaginationInputDto, @Request() req: any): Promise<any> {
    return this.bookCatalogCrudService.findAll(pagination, req.user.userId);
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiExactSearchBooks()
  async getBySearch(
    @Body() searchDto: BookExactSearchDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.bookCatalogSearchService.exactSearch(searchDto, pagination, req.user.userId);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSimpleFilterBooks()
  async getByFilterParam(
    @Query() termQuery: FilterTermQueryDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.bookCatalogSearchService.simpleFilter(termQuery.term, pagination, req.user.userId);
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiAdvancedFilterBooks()
  async getByAdvancedFilter(
    @Body() filters: BookFiltersDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.bookCatalogSearchService.advancedFilter(filters, pagination, req.user.userId);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiExportBooksCsv()
  async exportToCsv(
    @Query() filters: CsvExportFiltersDto,
    @Res() res: Response,
    @Request() req: any,
  ): Promise<any> {
    return this.bookCatalogSearchService.exportToCsv(filters, res, req.user.userId);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetBookById()
  async getById(@Param() params: GetByIdParamDto, @Request() req: any): Promise<any> {
    return this.bookCatalogCrudService.findById(params.id, req.user.userId);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateBook()
  async update(
    @Param() params: UpdateByIdParamDto,
    @Body() updateBookCatalogDto: UpdateBookCatalogDto,
    @Request() req: any,
  ): Promise<any> {
    return this.bookCatalogCrudService.update(params.id, updateBookCatalogDto, req.user.userId);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteBook()
  async remove(@Param() params: SoftDeleteParamDto, @Request() req: any): Promise<any> {
    return this.bookCatalogCrudService.softDelete(params.id, req.user.userId);
  }

  @Post(':id/upload-cover')
  @Auth(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('coverImage'))
  @ApiUploadBookCover()
  async uploadBookCover(
    @Param() params: GetByIdParamDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.fileUploadService.uploadBookCover(params.id, file, req.user.userId);
  }

  @Delete(':id/cover')
  @Auth(UserRole.ADMIN)
  @ApiRemoveBookCover()
  async removeBookCover(@Param() params: GetByIdParamDto, @Request() req: any) {
    return this.fileUploadService.removeBookCover(params.id, req.user.userId);
  }
}
