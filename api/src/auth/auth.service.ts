/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { UserService } from '../user/user.service';
import { I2FASecret, newJwtToken } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(_email: string, _pass: string): Promise<User> {
    throw new UnauthorizedException('Invalid credentials');
  }

  async get2FASecret(user: User): Promise<I2FASecret> {
    const secret = (await user.TFASecret) || authenticator.generateSecret();
    const otp_url = await authenticator.keyuri(
      user.intra_name,
      'transcendence',
      secret,
    );
    const qrcode = await toDataURL(otp_url);
    await this.usersService.set2FASsecret(user.id, secret);
    return {
      secret,
      otp_url,
      qrcode,
    };
  }
  async verify2FACode(userId: number, code: string): Promise<boolean> {
    const TFASecret = await this.usersService.get2FASsecret(userId);
    if (!TFASecret) throw new UnauthorizedException('User have not secret set');
    return authenticator.verify({
      token: code,
      secret: TFASecret,
    });
  }

  async reset2FASecret(user: User) {
    await this.usersService.set2FASsecret(user.id, null);
    return await this.get2FASecret(user);
  }

  async login(
    userid: number,
    isTwoFactorAuthenticated: boolean,
  ): Promise<newJwtToken> {
    const payload = {
      isTwoFactorAuthenticate: isTwoFactorAuthenticated,
      sub: userid,
    };
    return {
      access_token: this.jwtService.sign(payload),
      message: 'Login successful',
    };
  }
}
