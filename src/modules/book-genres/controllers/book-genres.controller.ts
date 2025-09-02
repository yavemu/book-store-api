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
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IBookGenreCrudService } from '../interfaces/book-genre-crud.service.interface';
import { IBookGenreSearchService } from '../interfaces/book-genre-search.service.interface';
import {
  CreateBookGenreDto,
  UpdateBookGenreDto,
  BookGenreExactSearchDto,
  BookGenreSimpleFilterDto,
  BookGenreFiltersDto,
  BookGenreCsvExportFiltersDto,
} from '../dto';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { PaginationDto } from '../../../common/dto/pagination.dto';
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
  async create(@Body() createBookGenreDto: CreateBookGenreDto, @Request() req) {
    return this.genreCrudService.create(createBookGenreDto, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetGenres()
  async findAll(@Query() pagination: PaginationDto) {
    return this.genreCrudService.findAll(pagination);
  }

  @Post('search')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchGenres()
  exactSearch(@Body() searchDto: BookGenreExactSearchDto) {
    return this.genreSearchService.exactSearch(searchDto);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterGenres()
  simpleFilter(@Query('term') term: string, @Query() pagination: PaginationDto) {
    return this.genreSearchService.simpleFilter(term, pagination);
  }

  @Post('advanced-filter')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiAdvancedFilterGenres()
  advancedFilter(@Body() filters: BookGenreFiltersDto, @Query() pagination: PaginationDto) {
    return this.genreSearchService.findWithFilters(filters, pagination);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportGenresCsv()
  async exportToCsv(@Query() filters: BookGenreCsvExportFiltersDto, @Res() res: Response) {
    const csvData = await this.genreSearchService.exportToCsv(filters);
    const filename = `book_genres_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetGenreById()
  async findOne(@Param('id') id: string) {
    return this.genreCrudService.findById(id);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateGenre()
  async update(
    @Param('id') id: string,
    @Body() updateBookGenreDto: UpdateBookGenreDto,
    @Request() req,
  ) {
    return this.genreCrudService.update(id, updateBookGenreDto, req.user.userId);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteGenre()
  async softDelete(@Param('id') id: string, @Request() req) {
    return this.genreCrudService.softDelete(id, req.user.userId);
  }
}
