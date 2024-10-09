import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiSecurity, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator';
import { JwtPayloadDto } from '../auth/dto';
import { ActiveGuard } from '../auth/guards/active.guard';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
@ApiTags('Пользовательские функции')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('self')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Проверка информации о себе' })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  async findOne(@JwtPayload() jwtPayload: JwtPayloadDto) {
    return this.userService.findOneByUuid(jwtPayload.uuid, false);
  }
}
