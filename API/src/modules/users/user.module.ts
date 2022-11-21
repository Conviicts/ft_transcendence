import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserController } from './controllers/user.controller';
import { FriendsController } from './controllers/friends.controller';
import { UserRepository } from './repositories/user.repository';
import { FriendsRepository } from './repositories/friends.repository';
import { UserService } from './services/user.service';
import { Avatar } from './entities/avatar.entity';
import { AvatarService } from './services/avatar.service';
import { FriendsService } from './services/friends.service';
import { ConnectionService } from './services/connection.service';

import { provideCustomRepository } from '../../custom-repository.util';
import { Connection } from './entities/connection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Avatar, Connection]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 86400,
      },
    }),
  ],
  controllers: [UserController, FriendsController],
  providers: [
    provideCustomRepository(User, UserRepository),
    provideCustomRepository(User, FriendsRepository),
    UserService,
    AvatarService,
    FriendsService,
    ConnectionService,
    JwtStrategy,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    UserService,
    ConnectionService,
    JwtModule,
  ],
})
export class UserModule {}
