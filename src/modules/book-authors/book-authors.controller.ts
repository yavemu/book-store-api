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
import { IBookAuthorService } from './interfaces/book-author.service.interface';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { BookAuthor } from './entities/book-author.entity';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import {
  ApiCreateAuthor,
  ApiGetAuthors,
  ApiGetAuthorById,
  ApiUpdateAuthor,
  ApiDeleteAuthor,
  ApiGetAuthorByName,
  ApiSearchAuthors
} from './decorators';

@ApiTags('Book Authors')
@Controller('book-authors')
export class BookAuthorsController {
  constructor(
    @Inject('IBookAuthorService')
    private readonly bookAuthorService: IBookAuthorService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateAuthor()
  create(
    @Body() createBookAuthorDto: CreateBookAuthorDto,
    @Request() req: any,
  ) {
    return this.bookAuthorService.create(createBookAuthorDto, req.user.id);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAuthors()
  findAll(@Query() pagination: PaginationDto) {
    return this.bookAuthorService.findAll(pagination);
  }

  @Get('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchAuthors()
  search(
    @Query('term') searchTerm: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookAuthorService.search(searchTerm, pagination);
  }

  @Get('by-name/:firstName/:lastName')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAuthorByName()
  findByFullName(
    @Param('firstName') firstName: string,
    @Param('lastName') lastName: string,
  ) {
    return this.bookAuthorService.findByFullName(firstName, lastName);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAuthorById()
  findOne(@Param('id') id: string) {
    return this.bookAuthorService.findById(id);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateAuthor()
  update(
    @Param('id') id: string,
    @Body() updateBookAuthorDto: UpdateBookAuthorDto,
    @Request() req: any,
  ) {
    return this.bookAuthorService.update(id, updateBookAuthorDto, req.user.id);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteAuthor()
  remove(@Param('id') id: string, @Request() req: any) {
    return this.bookAuthorService.softDelete(id, req.user.id);
  }
}