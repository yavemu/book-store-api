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
import { IBookAuthorCrudService, IBookAuthorSearchService, IUserContextService } from './interfaces';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';
import {
  BookAuthorFiltersDto,
  BookAuthorExactSearchDto,
  BookAuthorSimpleFilterDto,
  BookAuthorCsvExportFiltersDto,
} from './dto';
import {
  GetByIdParamDto,
  UpdateByIdParamDto,
  SoftDeleteParamDto,
} from '../../common/dto/operation-param.dto';
import { FilterTermQueryDto } from '../../common/dto/operation-query.dto';
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
  async create(
    @Body() createBookAuthorDto: CreateBookAuthorDto,
    @Request() req: any,
  ): Promise<any> {
    return this.crudService.create(createBookAuthorDto, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAuthors()
  async getAll(@Query() pagination: PaginationInputDto, @Request() req: any): Promise<any> {
    return this.crudService.findAll(pagination, req.user.userId);
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchAuthors()
  async getBySearch(
    @Body() searchDto: BookAuthorExactSearchDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.searchService.exactSearch(searchDto, pagination, req.user.userId);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterAuthorsRealtime()
  async getByFilterParam(
    @Query() termQuery: FilterTermQueryDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.searchService.simpleFilter(termQuery.term, pagination, req.user.userId);
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterAuthors()
  async getByAdvancedFilter(
    @Body() filters: BookAuthorFiltersDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.searchService.advancedFilter(filters, pagination, req.user.userId);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportAuthorsCsv()
  async exportToCsv(
    @Query() filters: BookAuthorCsvExportFiltersDto,
    @Res() res: Response,
    @Request() req: any,
  ): Promise<any> {
    return this.searchService.exportToCsv(filters, res, req.user.userId);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAuthorById()
  async getById(@Param() params: GetByIdParamDto, @Request() req: any): Promise<any> {
    return this.crudService.findById(params.id, req.user.userId);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateAuthor()
  async update(
    @Param() params: UpdateByIdParamDto,
    @Body() updateBookAuthorDto: UpdateBookAuthorDto,
    @Request() req: any,
  ): Promise<any> {
    return this.crudService.update(params.id, updateBookAuthorDto, req.user.userId);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteAuthor()
  async remove(@Param() params: SoftDeleteParamDto, @Request() req: any): Promise<any> {
    return this.crudService.softDelete(params.id, req.user.userId);
  }
}
