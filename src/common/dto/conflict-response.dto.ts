import { ApiProperty } from '@nestjs/swagger';

export class ConflictResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Conflict error message',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
  })
  error: string;
}