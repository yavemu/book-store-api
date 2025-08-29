import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto {
  @ApiProperty({
    example: 200,
    description: 'Status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Success',
    description: 'Response message',
  })
  message: string;
}
