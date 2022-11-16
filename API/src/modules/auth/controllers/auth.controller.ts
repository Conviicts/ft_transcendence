/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Res, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

import { FortyTwoGuard } from '../guards/auth.guard';
import { JwtPayload } from '../../users/strategy/jwt.strategy';

@ApiTags('Auth')
@Controller('api/auth/')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @ApiOperation({ summary: 'Authentication with 42 API' })
  @Get('login')
  @UseGuards(FortyTwoGuard)
  login() {}

  @ApiExcludeEndpoint()
  @Get('redirect')
  @UseGuards(FortyTwoGuard)
  async redirect(@Res({ passthrough: true }) res: Response, @Req() req) {
    const username = req.user['username'];
    const auth = false;
    const payload: JwtPayload = { username, auth };
    const accessToken: string = await this.jwtService.sign(payload);
    res.cookie('jwt', accessToken, { httpOnly: true });
    res.redirect(process.env.FRONT_URI);
  }
}
