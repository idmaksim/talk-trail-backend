import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { I18nService } from 'nestjs-i18n';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto, SignInUserDto, SignUpUserDto } from './dto';
import {
  AccessRefreshTokenResponseDto,
  AccessTokenResponseDto,
  LoginResponseDto,
  RefreshResponseDto,
} from '../../common/swagger/auth/res';
import { Description, Summary } from 'src/common/swagger/auth';

@ApiTags('Авторизация/регистрация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessRefreshTokenResponseDto })
  @ApiOperation({ summary: Summary.signUp, description: Description.signUp })
  async signUp(@Body() signUpDto: SignUpUserDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiOperation({ summary: Summary.signIn, description: Description.signIn })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInUserDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  @ApiOkResponse({ type: RefreshResponseDto })
  @ApiOperation({ summary: Summary.refresh, description: Description.refresh })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() tokenDto: RefreshTokenDto) {
    return this.authService.refresh(tokenDto.refreshToken);
  }
}
