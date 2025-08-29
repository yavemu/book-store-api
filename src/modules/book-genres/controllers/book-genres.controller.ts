import { Controller, Get, Post, Put, Delete, Param, Body, Request, Query, Inject } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IBookGenreCrudService } from "../interfaces/book-genre-crud.service.interface";
import { IBookGenreSearchService } from "../interfaces/book-genre-search.service.interface";
import { CreateBookGenreDto, UpdateBookGenreDto } from "../dto";
import { Auth } from "../../../common/decorators/auth.decorator";
import { UserRole } from "../../users/enums/user-role.enum";
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { ApiCreateBookGenre, ApiGetGenres, ApiGetGenreById, ApiUpdateGenre, ApiDeleteGenre, ApiSearchGenres } from "../decorators";

@ApiTags("Book Genres")
@Controller("genres")
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

  @Get("search")
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchGenres()
  async search(@Query("q") searchTerm: string, @Query() pagination: PaginationDto) {
    return this.genreSearchService.search(searchTerm, pagination);
  }

  @Get(":id")
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetGenreById()
  async findOne(@Param("id") id: string) {
    return this.genreCrudService.findById(id);
  }

  @Put(":id")
  @Auth(UserRole.ADMIN)
  @ApiUpdateGenre()
  async update(@Param("id") id: string, @Body() updateBookGenreDto: UpdateBookGenreDto, @Request() req) {
    return this.genreCrudService.update(id, updateBookGenreDto, req.user.userId);
  }

  @Delete(":id")
  @Auth(UserRole.ADMIN)
  @ApiDeleteGenre()
  async softDelete(@Param("id") id: string, @Request() req) {
    return this.genreCrudService.softDelete(id, req.user.userId);
  }
}
