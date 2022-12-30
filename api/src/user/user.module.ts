import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/chat/chat.service';
import { PenalitiesService } from 'src/chat/services/penalities/penalities.service';
import { ConnectedUsersModule } from 'src/connected-users/connected-users.module';
import { FriendsService } from 'src/friends/friends.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserController,
    UserService,
    JwtService,
    FriendsService,
    ChatService,
    PenalitiesService,
  ],
  imports: [PrismaModule, ConnectedUsersModule],
})
export class UserModule {}
