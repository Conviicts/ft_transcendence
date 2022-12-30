import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConnectedUsersService } from 'src/connected-users/connected-users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { sessionSerializer } from './passport/sessionSerializer';
import { FortyTwoStrategy } from './strategies/42.strategy';
import { Jwt2FAStrategy } from './strategies/jwt-2fa.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SESSION_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    Jwt2FAStrategy,
    JwtStrategy,
    FortyTwoStrategy,
    sessionSerializer,
    UserService,
    PrismaService,
    ConnectedUsersService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
