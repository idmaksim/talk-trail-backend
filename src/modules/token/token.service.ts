import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '../auth/dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(uuid: string, email: string): Promise<string> {
    return this.jwtService.sign({ uuid, email });
  }

  async generateRefreshToken(uuid: string, email: string): Promise<string> {
    return this.jwtService.sign(
      { uuid, email },
      {
        secret: this.configService.get('REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  async verifyRefreshToken(token: string): Promise<JwtPayloadDto> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('REFRESH_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
