import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/base/response';

export class RoleResponseDto extends BaseResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
