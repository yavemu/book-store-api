import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Not found error message',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
  })
  error: string;
}
