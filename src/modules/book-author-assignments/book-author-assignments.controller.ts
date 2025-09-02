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
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IBookAuthorAssignmentService } from './interfaces/book-author-assignment.service.interface';
import { IBookAuthorAssignmentSearchService } from './interfaces/book-author-assignment-search.service.interface';
import { CreateBookAuthorAssignmentDto } from './dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from './dto/update-book-author-assignment.dto';
import {
  AssignmentFiltersDto,
  AssignmentExactSearchDto,
  AssignmentSimpleFilterDto,
  AssignmentCsvExportFiltersDto,
} from './dto';
import { PaginationDto, PaginationInputDto, PaginatedResult } from '../../common/dto';
import { BookAuthorAssignment } from './entities/book-author-assignment.entity';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import {
  ApiCreateAssignment,
  ApiGetAssignments,
  ApiGetAssignmentById,
  ApiUpdateAssignment,
  ApiDeleteAssignment,
  ApiFilterAssignments,
  ApiFilterAssignmentsRealtime,
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
  findAll(@Query() pagination: PaginationInputDto) {
    return this.bookAuthorAssignmentService.findAll(pagination);
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchAssignments()
  exactSearch(@Body() searchDto: AssignmentExactSearchDto, @Query() pagination: PaginationInputDto) {
    return this.bookAuthorAssignmentSearchService.exactSearch(searchDto);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterAssignmentsRealtime()
  simpleFilter(@Query('term') term: string, @Query() pagination: PaginationInputDto) {
    // Validar que el término sea obligatorio
    if (!term || term.trim().length === 0) {
      throw new HttpException('Filter term is required', HttpStatus.BAD_REQUEST);
    }
    return this.bookAuthorAssignmentSearchService.simpleFilter(term, pagination);
  }

  @Post('advanced-filter')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterAssignments()
  advancedFilter(@Body() filters: AssignmentFiltersDto, @Query() pagination: PaginationInputDto) {
    return this.bookAuthorAssignmentSearchService.advancedFilter(filters, pagination);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportAssignmentsCsv()
  async exportToCsv(@Query() filters: AssignmentCsvExportFiltersDto, @Res() res: Response) {
    const csvData = await this.bookAuthorAssignmentSearchService.exportToCsv(filters);
    const filename = `book_author_assignments_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
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

  // Legacy method names for backward compatibility with tests
  async search(searchTerm: any, pagination: PaginationDto) {
    return this.exactSearch(searchTerm, pagination);
  }

  async filter(filters: any, pagination: PaginationDto) {
    return this.simpleFilter(filters.term || '', pagination);
  }

  async checkAssignment(bookId: string, authorId: string) {
    // Implementation for checking assignment
    return { exists: false, message: 'Method not implemented yet' };
  }
}
