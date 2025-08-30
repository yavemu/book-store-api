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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IBookAuthorAssignmentService } from './interfaces/book-author-assignment.service.interface';
import { IBookAuthorAssignmentSearchService } from './interfaces/book-author-assignment-search.service.interface';
import { CreateBookAuthorAssignmentDto } from './dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from './dto/update-book-author-assignment.dto';
import { AssignmentFiltersDto, AssignmentCsvExportFiltersDto } from './dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { BookAuthorAssignment } from './entities/book-author-assignment.entity';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import {
  ApiCreateAssignment,
  ApiGetAssignments,
  ApiGetAssignmentById,
  ApiCheckAssignment,
  ApiUpdateAssignment,
  ApiDeleteAssignment,
  ApiFilterAssignments,
  ApiExportAssignmentsCsv,
  ApiSearchAssignments,
} from './decorators';

@ApiTags('Book Author Assignments')
@Controller('book-author-assignments')
export class BookAuthorAssignmentsController {
  constructor(
    @Inject('IBookAuthorAssignmentService')
    private readonly bookAuthorAssignmentService: IBookAuthorAssignmentService,
    @Inject('IBookAuthorAssignmentSearchService')
    private readonly bookAuthorAssignmentSearchService: IBookAuthorAssignmentSearchService,
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

  @Get('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchAssignments()
  async search(@Query('term') searchTerm: string, @Query() pagination: PaginationDto) {
    return this.bookAuthorAssignmentSearchService.searchAssignments(searchTerm, pagination);
  }

  @Post('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterAssignments()
  async filter(@Body() filters: AssignmentFiltersDto, @Query() pagination: PaginationDto) {
    return this.bookAuthorAssignmentSearchService.findAssignmentsWithFilters(filters, pagination);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportAssignmentsCsv()
  async exportToCsv(@Query() filters: AssignmentCsvExportFiltersDto, @Res() res: Response) {
    const csvData = await this.bookAuthorAssignmentSearchService.exportAssignmentsToCsv(filters);
    const filename = `book_author_assignments_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  }

  @Get('check/:bookId/:authorId')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiCheckAssignment()
  async checkAssignment(@Param('bookId') bookId: string, @Param('authorId') authorId: string) {
    return this.bookAuthorAssignmentService.checkAssignmentExists(bookId, authorId);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAssignmentById()
  findOne(@Param('id') id: string) {
    return this.bookAuthorAssignmentService.findById(id);
  }

  @Put(':id')
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
