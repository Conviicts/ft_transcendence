export class I2FASecret {
  secret: string;
  otp_url?: string;
  qrcode: string;
}

export class JwtPayload {
  sub: string;
  have2FA: boolean;
  iat?: number;
  exp?: number;
}

export class newJwtToken {
  access_token: string;
  message: string;
}
