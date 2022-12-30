import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/auth.interface';
import { IUserInfo } from 'src/user/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserService) private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SESSION_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<IUserInfo> {
    return await this.userService.findOne(Number.parseInt(payload.sub));
  }
}
