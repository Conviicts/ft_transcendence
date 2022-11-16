import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './services/user.service';

import { provideCustomRepository } from '../../custom-repository.util';
import { Avatar } from './entities/avatar.entity';
import { AvatarService } from './services/avatar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Avatar]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 86400,
      },
    }),
  ],
  controllers: [UserController],
  providers: [
    provideCustomRepository(User, UserRepository),
    UserService,
    AvatarService,
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule, UserService, JwtModule],
})
export class UserModule {}
