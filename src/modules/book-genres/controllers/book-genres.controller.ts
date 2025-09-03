import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  Query,
  Inject,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IBookGenreCrudService } from '../interfaces';
import { IBookGenreSearchService } from '../interfaces';
import {
  CreateBookGenreDto,
  UpdateBookGenreDto,
  BookGenreExactSearchDto,
  BookGenreSimpleFilterDto,
  BookGenreFiltersDto,
  BookGenreCsvExportFiltersDto,
} from '../dto';
import {
  GetByIdParamDto,
  UpdateByIdParamDto,
  SoftDeleteParamDto,
} from '../../../common/dto/operation-param.dto';
import { FilterTermQueryDto } from '../../../common/dto/operation-query.dto';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';
import {
  ApiCreateBookGenre,
  ApiGetGenres,
  ApiGetGenreById,
  ApiUpdateGenre,
  ApiDeleteGenre,
  ApiSearchGenres,
  ApiExportGenresCsv,
  ApiFilterGenres,
  ApiAdvancedFilterGenres,
} from '../decorators';

@ApiTags('Book Genres')
@Controller('genres')
export class BookGenresController {
  constructor(
    @Inject('IBookGenreCrudService')
    private readonly genreCrudService: IBookGenreCrudService,
    @Inject('IBookGenreSearchService')
    private readonly genreSearchService: IBookGenreSearchService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateBookGenre()
  async create(@Body() createBookGenreDto: CreateBookGenreDto, @Request() req): Promise<any> {
    return this.genreCrudService.create(createBookGenreDto, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetGenres()
  async getAll(@Query() pagination: PaginationInputDto, @Request() req): Promise<any> {
    return this.genreCrudService.findAll(pagination, req.user.userId);
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchGenres()
  async getBySearch(
    @Body() searchDto: BookGenreExactSearchDto,
    @Query() pagination: PaginationInputDto,
    @Request() req,
  ): Promise<any> {
    return this.genreSearchService.exactSearch(searchDto, pagination, req.user.userId);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterGenres()
  async getByFilterParam(
    @Query() termQuery: FilterTermQueryDto,
    @Query() pagination: PaginationInputDto,
    @Request() req,
  ): Promise<any> {
    return this.genreSearchService.simpleFilter(termQuery.term, pagination, req.user.userId);
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiAdvancedFilterGenres()
  async getByAdvancedFilter(
    @Body() filters: BookGenreFiltersDto,
    @Query() pagination: PaginationInputDto,
    @Request() req,
  ): Promise<any> {
    return this.genreSearchService.findWithFilters(filters, pagination, req.user.userId);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportGenresCsv()
  async exportToCsv(
    @Query() filters: BookGenreCsvExportFiltersDto,
    @Res() res: Response,
    @Request() req,
  ): Promise<any> {
    return this.genreSearchService.exportToCsv(filters, res, req.user.userId);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetGenreById()
  async getById(@Param() params: GetByIdParamDto, @Request() req): Promise<any> {
    return this.genreCrudService.findById(params.id, req.user.userId);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateGenre()
  async update(
    @Param() params: UpdateByIdParamDto,
    @Body() updateBookGenreDto: UpdateBookGenreDto,
    @Request() req,
  ): Promise<any> {
    return this.genreCrudService.update(params.id, updateBookGenreDto, req.user.userId);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteGenre()
  async remove(@Param() params: SoftDeleteParamDto, @Request() req): Promise<any> {
    return this.genreCrudService.softDelete(params.id, req.user.userId);
  }
}
