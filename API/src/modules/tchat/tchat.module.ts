import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { ChannelController } from './channel.controller';
import { ChannelService } from './services/channel.service'
import { Channel } from './entities/channel.entity';
import { JwtStrategy } from '../users/strategy/jwt.strategy';

import { provideCustomRepository } from '../users/custom-repository.util';
import { TextChannel } from './entities/text-channel.entity';
import { Log } from './entities/log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, TextChannel, User, Log]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 86400,
      },
    }),
  ],
  controllers: [ChannelController],
  providers: [
    provideCustomRepository(User, UserRepository),
    ChannelService,
    UserService,
    JwtStrategy,
  ],
  exports: [],
})
export class TchatModule {}
