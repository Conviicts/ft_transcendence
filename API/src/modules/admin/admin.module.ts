import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/repositories/user.repository';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserService } from '../users/services/user.service';
import { JwtStrategy } from '../users/strategy/jwt.strategy';
import { Avatar } from '../users/entities/avatar.entity';
import { AvatarService } from '../users/services/avatar.service';
import { FriendsRepository } from '../users/repositories/friends.repository';

import { provideCustomRepository } from '../../custom-repository.util';

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
  controllers: [AdminController],
  providers: [
    provideCustomRepository(User, UserRepository),
    provideCustomRepository(User, FriendsRepository),
    AdminService,
    AvatarService,
    UserService,
    JwtStrategy,
  ],
})
export class AdminModule {}
