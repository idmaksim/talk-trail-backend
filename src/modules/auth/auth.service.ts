import { Injectable, Logger } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { SignUpUserDto, SignInUserDto } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(userDto: SignUpUserDto) {
    const { uuid, email } = await this.userService.create(userDto);
    this.logger.log(`Пользователь ${userDto.email} зарегистрировался`);
    return {
      accessToken: await this.tokenService.generateAccessToken(uuid, email),
      refreshToken: await this.tokenService.generateRefreshToken(uuid, email),
    };
  }

  async signIn(userDto: SignInUserDto) {
    const user = await this.userService.findOneByEmail(userDto.email, false);
    this.logger.log(`Пользователь ${userDto.email} выполнил вход`);
    return {
      accessToken: await this.tokenService.generateAccessToken(
        user.uuid,
        user.email,
      ),
      refreshToken: await this.tokenService.generateRefreshToken(
        user.uuid,
        user.email,
      ),
      user,
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const newAccessToken = await this.tokenService.generateAccessToken(
      payload.uuid,
      payload.email,
    );
    const user = await this.userService.findOneByEmail(payload.email, false);
    this.logger.log(`Пользователь ${payload.email} получил новый access-token`);
    return { accessToken: newAccessToken, user };
  }
}
