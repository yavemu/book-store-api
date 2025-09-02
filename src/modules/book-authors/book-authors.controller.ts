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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IBookAuthorCrudService } from './interfaces/book-author-crud.service.interface';
import { IBookAuthorSearchService } from './interfaces/book-author-search.service.interface';
import { IUserContextService } from './interfaces/user-context.service.interface';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';
import {
  BookAuthorFiltersDto,
  BookAuthorExactSearchDto,
  BookAuthorSimpleFilterDto,
  BookAuthorCsvExportFiltersDto,
} from './dto';
import { PaginationInputDto } from '../../common/dto/pagination-input.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import {
  ApiCreateAuthor,
  ApiGetAuthors,
  ApiGetAuthorById,
  ApiUpdateAuthor,
  ApiDeleteAuthor,
  ApiSearchAuthors,
  ApiFilterAuthors,
  ApiFilterAuthorsRealtime,
  ApiExportAuthorsCsv,
} from './decorators';

@ApiTags('Book Authors')
@Controller('book-authors')
export class BookAuthorsController {
  constructor(
    @Inject('IBookAuthorCrudService')
    private readonly crudService: IBookAuthorCrudService,
    @Inject('IBookAuthorSearchService')
    private readonly searchService: IBookAuthorSearchService,
    @Inject('IUserContextService')
    private readonly userContextService: IUserContextService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateAuthor()
  create(@Body() createBookAuthorDto: CreateBookAuthorDto, @Request() req: any) {
    const userId = this.userContextService.extractUserId(req);
    return this.crudService.create(createBookAuthorDto, userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAuthors()
  findAll(@Query() pagination: PaginationInputDto) {
    return this.crudService.findAll(pagination);
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchAuthors()
  exactSearch(@Body() searchDto: BookAuthorExactSearchDto, @Query() pagination: PaginationInputDto) {
    const paginationDto: PaginationDto = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      sortBy: pagination.sortBy || 'createdAt',
      sortOrder: pagination.sortOrder || 'DESC',
      offset: pagination.offset,
    };
    return this.searchService.exactSearch(searchDto, paginationDto);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterAuthorsRealtime()
  simpleFilter(@Query('term') term: string, @Query() pagination: PaginationInputDto) {
    // Validar que el término sea obligatorio
    if (!term || term.trim().length === 0) {
      throw new HttpException('Filter term is required', HttpStatus.BAD_REQUEST);
    }
    return this.searchService.simpleFilter(term, pagination);
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterAuthors()
  advancedFilter(@Body() filters: BookAuthorFiltersDto, @Query() pagination: PaginationInputDto) {
    return this.searchService.advancedFilter(filters, pagination);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportAuthorsCsv()
  async exportToCsv(@Query() filters: BookAuthorCsvExportFiltersDto, @Res() res: Response) {
    const csvData = await this.searchService.exportToCsv(filters);
    const filename = `book_authors_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAuthorById()
  findOne(@Param('id') id: string) {
    return this.crudService.findById(id);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateAuthor()
  update(
    @Param('id') id: string,
    @Body() updateBookAuthorDto: UpdateBookAuthorDto,
    @Request() req: any,
  ) {
    const userId = this.userContextService.extractUserId(req);
    return this.crudService.update(id, updateBookAuthorDto, userId);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteAuthor()
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = this.userContextService.extractUserId(req);
    return this.crudService.softDelete(id, userId);
  }

  // Legacy method names for backward compatibility with tests
  async search(searchTerm: any, pagination: PaginationInputDto) {
    return this.exactSearch(searchTerm, pagination);
  }

  async filter(filters: any, pagination: PaginationInputDto) {
    return this.simpleFilter(filters.term || '', pagination);
  }
}
