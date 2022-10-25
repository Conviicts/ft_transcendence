import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, 'intra-oauth') {
  constructor(
    private authService: AuthService,
    private httpService: HttpService,
  ) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.TOKEN_ID,
      clientSecret: process.env.TOKEN_SECRET,
      callbackURL:
        `http://localhost/api/v1/auth/login`,
    });
  }

  async validate(accessToken: string): Promise<any> {
    const { data } = await this.httpService
      .get('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();
    return await this.authService.validateSignin(data.id);
  }
}