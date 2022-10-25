import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './auth.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AuthController],
  providers: [
    FortyTwoStrategy,
    AuthService,
  ],
  imports: [HttpModule, UserModule],
  exports: [AuthService],
})
export class AuthModule {}