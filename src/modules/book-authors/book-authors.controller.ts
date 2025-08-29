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
import { IBookAuthorCrudService } from './interfaces/book-author-crud.service.interface';
import { IBookAuthorSearchService } from './interfaces/book-author-search.service.interface';
import { IUserContextService } from './interfaces/user-context.service.interface';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';
import { PaginationDto } from "../../common/dto/pagination.dto";
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
  create(
    @Body() createBookAuthorDto: CreateBookAuthorDto,
    @Request() req: any,
  ) {
    const userId = this.userContextService.extractUserId(req);
    return this.crudService.create(createBookAuthorDto, userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAuthors()
  findAll(@Query() pagination: PaginationDto) {
    return this.crudService.findAll(pagination);
  }

  @Get('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchAuthors()
  search(
    @Query('term') searchTerm: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.searchService.search(searchTerm, pagination);
  }

  @Get('by-name/:firstName/:lastName')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAuthorByName()
  findByFullName(
    @Param('firstName') firstName: string,
    @Param('lastName') lastName: string,
  ) {
    return this.searchService.findByFullName(firstName, lastName);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAuthorById()
  findOne(@Param('id') id: string) {
    return this.crudService.findById(id);
  }

  @Patch(':id')
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
}