import { Controller, Get, Res, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';

import { FortyTwoGuard } from './guards/auth.guard';
import { JwtPayload } from '../users/strategy/jwt.strategy';

@ApiTags('auth')
@Controller('api/auth/')
export class AuthController {
	constructor (
		private httpService: HttpService,
		private jwtService: JwtService,
	) {}

	@ApiOperation({summary: 'Authentication with 42 API'})
	@Get('login')
	@UseGuards(FortyTwoGuard)
	login() { }

	@ApiOperation({summary: 'Redirection to front after 42 authentication'})
	@Get('redirect')
	@UseGuards(FortyTwoGuard)
	async redirect(@Res({passthrough: true}) res: Response, @Req() req) {
		const username = req.user['username'];
		let auth: boolean = false;
		const payload: JwtPayload = { username, auth };
		const accessToken: string = await this.jwtService.sign(payload);
		res.cookie('jwt', accessToken, {httpOnly: true});
		res.redirect(process.env.FRONT_URI);
	}
}