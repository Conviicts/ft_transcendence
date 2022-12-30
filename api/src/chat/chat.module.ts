import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PenalitiesService } from './services/penalities/penalities.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConnectedUsersService } from 'src/connected-users/connected-users.service';

@Module({
  controllers: [ChatController],
  imports: [PrismaModule, UserModule, ChatModule, JwtModule],
  exports: [PenalitiesService],
  providers: [
    ChatService,
    PrismaService,
    ConnectedUsersService,
    UserService,
    PenalitiesService,
  ],
})
export class ChatModule {}
