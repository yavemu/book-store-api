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
import { IBookAuthorAssignmentService, IBookAuthorAssignmentSearchService } from './interfaces';
import { CreateBookAuthorAssignmentDto } from './dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from './dto/update-book-author-assignment.dto';
import {
  AssignmentFiltersDto,
  AssignmentExactSearchDto,
  AssignmentSimpleFilterDto,
  AssignmentCsvExportFiltersDto,
} from './dto';
import {
  GetByIdParamDto,
  UpdateByIdParamDto,
  SoftDeleteParamDto,
} from '../../common/dto/operation-param.dto';
import { FilterTermQueryDto } from '../../common/dto/operation-query.dto';
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
  async create(
    @Body() createBookAuthorAssignmentDto: CreateBookAuthorAssignmentDto,
    @Request() req: any,
  ): Promise<any> {
    return this.bookAuthorAssignmentService.create(createBookAuthorAssignmentDto, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAssignments()
  async getAll(@Query() pagination: PaginationInputDto, @Request() req: any): Promise<any> {
    return this.bookAuthorAssignmentService.findAll(pagination, req.user.userId);
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchAssignments()
  async getBySearch(
    @Body() searchDto: AssignmentExactSearchDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.bookAuthorAssignmentSearchService.exactSearch(
      searchDto,
      pagination,
      req.user.userId,
    );
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterAssignmentsRealtime()
  async getByFilterParam(
    @Query() termQuery: FilterTermQueryDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.bookAuthorAssignmentSearchService.simpleFilter(
      termQuery.term,
      pagination,
      req.user.userId,
    );
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterAssignments()
  async getByAdvancedFilter(
    @Body() filters: AssignmentFiltersDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.bookAuthorAssignmentSearchService.advancedFilter(
      filters,
      pagination,
      req.user.userId,
    );
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportAssignmentsCsv()
  async exportToCsv(
    @Query() filters: AssignmentCsvExportFiltersDto,
    @Res() res: Response,
    @Request() req: any,
  ): Promise<any> {
    return this.bookAuthorAssignmentSearchService.exportToCsv(filters, res, req.user.userId);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetAssignmentById()
  async getById(@Param() params: GetByIdParamDto, @Request() req: any): Promise<any> {
    return this.bookAuthorAssignmentService.findById(params.id, req.user.userId);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateAssignment()
  async update(
    @Param() params: UpdateByIdParamDto,
    @Body() updateBookAuthorAssignmentDto: UpdateBookAuthorAssignmentDto,
    @Request() req: any,
  ): Promise<any> {
    return this.bookAuthorAssignmentService.update(
      params.id,
      updateBookAuthorAssignmentDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteAssignment()
  async remove(@Param() params: SoftDeleteParamDto, @Request() req: any): Promise<any> {
    return this.bookAuthorAssignmentService.softDelete(params.id, req.user.userId);
  }
}
