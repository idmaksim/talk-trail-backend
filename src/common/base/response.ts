import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
