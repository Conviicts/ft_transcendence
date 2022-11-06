import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-42';

import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.TOKEN_ID,
      clientSecret: process.env.TOKEN_SECRET,
      callbackURL: process.env.API_REDIRECT,
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    const { username } = profile;
    const user = {
      username: username,
      email: profile['emails'][0]['value'],
      password: username,
      login42: username,
    };
    return this.authService.validateUser(user);
  }
}
