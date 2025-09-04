import { ApiProperty } from '@nestjs/swagger';

export class RoleDataDto {
  @ApiProperty({
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Role name',
    example: 'ADMIN',
  })
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator role with full access',
  })
  description: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Update timestamp',
    example: '2024-01-15T15:45:00.000Z',
  })
  updatedAt: Date;
}