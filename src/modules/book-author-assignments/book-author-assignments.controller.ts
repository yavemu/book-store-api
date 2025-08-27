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
import { IBookAuthorAssignmentService } from './interfaces/book-author-assignment.service.interface';
import { CreateBookAuthorAssignmentDto } from './dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from './dto/update-book-author-assignment.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { BookAuthorAssignment } from './entities/book-author-assignment.entity';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import {
  ApiCreateAssignment,
  ApiGetAssignments,
  ApiGetAssignmentById,
  ApiGetAssignmentsByBook,
  ApiGetAssignmentsByAuthor,
  ApiCheckAssignment,
  ApiUpdateAssignment,
  ApiDeleteAssignment
} from './decorators';

@ApiTags('Book Author Assignments')
@Controller('book-author-assignments')
export class BookAuthorAssignmentsController {
  constructor(
    @Inject('IBookAuthorAssignmentService')
    private readonly bookAuthorAssignmentService: IBookAuthorAssignmentService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateAssignment()
  create(
    @Body() createBookAuthorAssignmentDto: CreateBookAuthorAssignmentDto,
    @Request() req: any,
  ) {
    return this.bookAuthorAssignmentService.create(createBookAuthorAssignmentDto, req.user.id);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAssignments()
  findAll(@Query() pagination: PaginationDto) {
    return this.bookAuthorAssignmentService.findAll(pagination);
  }

  @Get('by-book/:bookId')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAssignmentsByBook()
  findByBook(
    @Param('bookId') bookId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookAuthorAssignmentService.findByBook(bookId, pagination);
  }

  @Get('by-author/:authorId')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAssignmentsByAuthor()
  findByAuthor(
    @Param('authorId') authorId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.bookAuthorAssignmentService.findByAuthor(authorId, pagination);
  }

  @Get('check/:bookId/:authorId')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiCheckAssignment()
  async checkAssignment(
    @Param('bookId') bookId: string,
    @Param('authorId') authorId: string,
  ) {
    return this.bookAuthorAssignmentService.checkAssignmentExists(bookId, authorId);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAssignmentById()
  findOne(@Param('id') id: string) {
    return this.bookAuthorAssignmentService.findById(id);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateAssignment()
  update(
    @Param('id') id: string,
    @Body() updateBookAuthorAssignmentDto: UpdateBookAuthorAssignmentDto,
    @Request() req: any,
  ) {
    return this.bookAuthorAssignmentService.update(id, updateBookAuthorAssignmentDto, req.user.id);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteAssignment()
  remove(@Param('id') id: string, @Request() req: any) {
    return this.bookAuthorAssignmentService.softDelete(id, req.user.id);
  }
}