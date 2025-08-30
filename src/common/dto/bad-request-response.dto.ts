import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message or array of validation errors',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error type',
  })
  error: string;
}
