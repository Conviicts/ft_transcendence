import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('INTRA_CLIENT_ID'),
      clientSecret: configService.get<string>('INTRA_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/api/auth/42/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const intraUser = {
      email: profile.emails[0].value,
      intra_name: profile.username,
      intra_id: Number.parseInt(profile.id),
      avatar: profile._json.image.link,
      username: profile.username,
    };
    const user = await this.userService.findByEmail(intraUser.email);
    if (!user) {
      return await this.userService.createIntraUser(intraUser);
    }
    return user;
  }
}
