import { Injectable, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { parse } from 'cookie';

import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../../users/strategy/jwt.strategy';
import { UserRepository } from '../../users/user.repository';

@Injectable()
export class UserConnected implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository
    ) {}

    async canActivate(context: any): Promise<boolean> {
		const cookie = context.args[0].handshake.headers['cookie'];
		const { jwt: token } = parse(cookie);
		const payload: JwtPayload = this.jwtService.verify(token, {secret: process.env.SECRET_JWT});
		const {username} = payload;
		const user: User = await this.userRepository.findOne({ where: { username } });

        if (payload['auth'] === false && user.twoFactor === true) {
            return false;
        }
        return true;
    }
}