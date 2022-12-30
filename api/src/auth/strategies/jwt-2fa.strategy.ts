import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/auth.interface';
import { IUserInfo } from 'src/user/interfaces/user.interface';

@Injectable()
export class Jwt2FAStrategy extends PassportStrategy(Strategy, 'jwt_tfa') {
  constructor(@Inject(UserService) private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SESSION_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user: IUserInfo = await this.userService.findOne(
      Number.parseInt(payload.sub),
    );
    if (!user.TFAEnabled) {
      return user;
    }
    if (payload.have2FA) {
      return user;
    }
    throw new UnauthorizedException({ message: '2FA_REQUIRED' });
  }
}
