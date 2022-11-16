import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../users/user.module';
import { ChannelService } from './services/channel.service';
import { Channel } from './entities/channel.entity';
import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/user.repository';
import { ConnectedUser } from './entities/connected-user.entity';
import { ConnectedUserService } from './services/connected-user.service';
import { Message } from './entities/message.entity';
import { JoinedChannel } from './entities/joined-channel.entity';
import { MessageService } from './services/message.service';
import { JoinedChannelService } from './services/joined-channel.service';
import { UserRole } from '../users/entities/user-role.entity';
import { UserRoleService } from './services/user-role.service';
import { TchatGateway } from './tchat.gateway';

import { provideCustomRepository } from '../../custom-repository.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      ConnectedUser,
      Message,
      JoinedChannel,
      UserRole,
    ]),
    UserModule,
  ],
  providers: [
    TchatGateway,
    provideCustomRepository(User, UserRepository),
    ChannelService,
    ConnectedUserService,
    MessageService,
    JoinedChannelService,
    UserRoleService,
  ],
  exports: [TchatGateway],
})
export class TchatModule {}
