import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { FortyTwoStrategy } from './strategy/auth.strategy';

@Module({
	imports: [
		forwardRef(() => UserModule), 
		HttpModule
	],
	controllers: [AuthController],
	providers: [
		FortyTwoStrategy,
		AuthService,
	],
})
export class AuthModule {}
