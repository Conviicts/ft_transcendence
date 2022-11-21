import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../users/user.module';
import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/repositories/user.repository';
import { TchatGateway } from './tchat.gateway';

import { provideCustomRepository } from '../../custom-repository.util';
import { FriendsRepository } from '../users/repositories/friends.repository';
import { FriendsService } from '../users/services/friends.service';
import { PrivateMessage } from './entities/private-message.entity';
import { PublicChannel } from './entities/public-channel.entity';
import { MessageLogs } from './entities/message-log.entity';
import { TchatController } from './controllers/tchat.controller';
import { MutedUser } from './entities/muted.entity';
import { BannedUser } from './entities/banned.entity';
import { PrivateMessageService } from './services/private-message.service';
import { PublicChannelService } from './services/public-channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PrivateMessage,
      PublicChannel,
      MessageLogs,
      MutedUser,
      BannedUser,
    ]),
    UserModule,
  ],
  providers: [
    provideCustomRepository(User, UserRepository),
    provideCustomRepository(User, FriendsRepository),
    PrivateMessageService,
    PublicChannelService,
    TchatGateway,
    FriendsService,
  ],
  controllers: [TchatController],
  exports: [TchatGateway],
})
export class TchatModule {}
