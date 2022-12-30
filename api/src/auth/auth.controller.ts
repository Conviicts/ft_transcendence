/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Request,
  Get,
  Body,
  Post,
  UseGuards,
  Res,
  Req,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { FortyTwoGuard, JwtAuthGuard } from './guards/auth.guard';
import { TFALoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user.id, false);
  }

  @Get('42')
  @UseGuards(FortyTwoGuard)
  async login42() {}

  @Get('42/callback')
  @UseGuards(FortyTwoGuard)
  async callback(@Req() req: any, @Res() res: any) {
    const token = await this.authService.login(req.user.id, false);
    res.redirect(
      this.configService.get('FRONT_URI') + '/login/' + token.access_token,
    );
    return token;
  }

  @Post('2fa')
  @UseGuards(JwtAuthGuard)
  async authenticate(@Request() request, @Body() body: TFALoginDto) {
    const isCodeValid = await this.authService.verify2FACode(
      request.user.id,
      body.TFACode,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return this.authService.login(request.user.id, true);
  }

  @Get('2fa/secret')
  @UseGuards(JwtAuthGuard)
  async generate2FACode(@Request() req: any) {
    return this.authService.get2FASecret(req.user);
  }

  @Post('2fa/reset')
  @UseGuards(JwtAuthGuard)
  async reset2FASecret(@Request() req: any, @Res() res: any) {
    this.authService.reset2FASecret(req.user);
    res.status('200').redirect('secret');
  }

  @Get('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disable2FA(@Request() req: any) {
    return await this.userService.set2FAEnable(req.user.id, false);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@Request() req: any, @Body() data: TFALoginDto) {
    const isCodeValid = await this.authService.verify2FACode(
      req.user.id,
      data.TFACode,
    );
    if (isCodeValid) {
      return await this.userService.set2FAEnable(req.user.id, true);
    }
    throw new HttpException('Invalid 2FA code', 401);
  }
}
