import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

import { provideCustomRepository } from './custom-repository.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 86400,
      },
    }),
  ],
  controllers: [UserController],
  providers: [provideCustomRepository(User, UserRepository), UserService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, UserService, JwtModule],
})
export class UserModule {}