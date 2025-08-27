import { Controller, Get, Post, Put, Delete, Param, Body, Request, ForbiddenException, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BookGenreService } from "./services/book-genre.service";
import { CreateBookGenreDto, UpdateBookGenreDto } from "./dto";
import { Auth } from "../../common/decorators/auth.decorator";
import { UserRole } from "../users/enums/user-role.enum";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { ApiCreateBookGenre, ApiGetGenres, ApiGetGenreById, ApiUpdateGenre, ApiDeleteGenre, ApiSearchGenres } from "./decorators";

@ApiTags("Book Genres")
@Controller("genres")
export class BookGenresController {
  constructor(private readonly genreService: BookGenreService) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateBookGenre()
  async create(@Body() createBookGenreDto: CreateBookGenreDto, @Request() req) {
    return this.genreService.create(createBookGenreDto, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetGenres()
  async findAll(@Query() pagination: PaginationDto) {
    return this.genreService.findAll(pagination);
  }

  @Get("search")
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchGenres()
  async search(@Query("q") searchTerm: string, @Query() pagination: PaginationDto) {
    return this.genreService.search(searchTerm, pagination);
  }

  @Get(":id")
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetGenreById()
  async findOne(@Param("id") id: string) {
    return this.genreService.findById(id);
  }

  @Put(":id")
  @Auth(UserRole.ADMIN)
  @ApiUpdateGenre()
  async update(@Param("id") id: string, @Body() updateBookGenreDto: UpdateBookGenreDto, @Request() req) {
    return this.genreService.update(id, updateBookGenreDto, req.user.userId);
  }

  @Delete(":id")
  @Auth(UserRole.ADMIN)
  @ApiDeleteGenre()
  async softDelete(@Param("id") id: string, @Request() req) {
    await this.genreService.softDelete(id, req.user.userId);
    return { message: "Genre deleted successfully" };
  }
}
