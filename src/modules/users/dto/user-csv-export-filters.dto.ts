import { IsOptional, IsString, IsEmail, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';

export class UserCsvExportFiltersDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Search term for user full name',
    example: 'John Doe',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: 'Filter by user email',
    example: 'john.doe@example.com',
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({
    description: 'Filter by user role',
    example: UserRole.USER,
    enum: UserRole,
    required: false,
  })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiPropertyOptional({
    description: 'Filter by active status (not deleted)',
    example: true,
    required: false,
  })
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Start date for creation date range filter',
    example: '2023-01-01',
    format: 'date',
    required: false,
  })
  createdDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'End date for creation date range filter',
    example: '2023-12-31',
    format: 'date',
    required: false,
  })
  createdDateTo?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Start date for last updated date range filter',
    example: '2023-01-01',
    format: 'date',
    required: false,
  })
  updatedDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'End date for last updated date range filter',
    example: '2023-12-31',
    format: 'date',
    required: false,
  })
  updatedDateTo?: string;
}
