import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Forbidden error message',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
  })
  error: string;
}
