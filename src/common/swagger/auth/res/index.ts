import { ApiProperty } from '@nestjs/swagger';
export class AccessTokenResponseDto {
  @ApiProperty()
  accessToken: string;
}

export class AccessRefreshTokenResponseDto extends AccessTokenResponseDto {
  @ApiProperty()
  refreshToken: string;
}

export class LoginResponseDto extends AccessRefreshTokenResponseDto {
  @ApiProperty()
  user: any;
}

export class RefreshResponseDto extends LoginResponseDto {}
