import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { TwoFAController } from './controllers/2fa.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../users/user.module';
import { FortyTwoStrategy } from './strategy/auth.strategy';

@Module({
  imports: [forwardRef(() => UserModule), HttpModule],
  controllers: [AuthController, TwoFAController],
  providers: [FortyTwoStrategy, AuthService],
})
export class AuthModule {}
