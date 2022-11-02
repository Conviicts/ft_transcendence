import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express"

import { UserRepository } from "../user.repository";
import { User } from "../entities/user.entity";

export interface JwtPayload {
    username: string;
    auth: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor (
        @InjectRepository(UserRepository)
        private usersRepository: UserRepository,
    ){
        super({
            secretOrKey: process.env.SECRET,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    let accessToken = request?.cookies["jwt"];
                    return accessToken;
                }
            ]),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user: User = await this.usersRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}