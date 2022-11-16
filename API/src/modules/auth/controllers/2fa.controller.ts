/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Get,
  Res,
  UseGuards,
  Req,
  Param,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';

import { JwtPayload } from '../../users/strategy/jwt.strategy';
import { User } from '../../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('2FA')
@Controller('api/auth/2fa')
export class TwoFAController {
  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Provide you QR Code' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getQRCode(@Req() req) {
    const user: User = req.user;
    const resp = await this.httpService
      .get(
        `https://www.authenticatorApi.com/pair.aspx?AppName=transcendance42&AppInfo=${user.username}&SecretCode=${user.uid}`,
      )
      .toPromise();
    return resp.data;
  }

  @ApiOperation({ summary: '2FA authentication' })
  @ApiParam({
    name: 'secret',
    required: true,
    description: 'authentication with google authenticator',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('/:secret')
  async validate(
    @Param('secret') secret,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user: User = req.user;
    const resp = await this.httpService
      .get(
        `https://www.authenticatorApi.com/Validate.aspx?Pin=${secret}&SecretCode=${user.uid}`,
      )
      .toPromise();
    if (resp.data === 'True') {
      const username = user.username;
      const auth = true;
      const payload: JwtPayload = { username, auth };
      const accessToken: string = await this.jwtService.sign(payload);
      res.cookie('jwt', accessToken, { httpOnly: true });
    }
    return resp.data;
  }
}
