import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { ConnectedUsersModule } from './connected-users/connected-users.module';
import { ChatService } from './chat/chat.service';
import { WschatService } from './wschat/wschat.service';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { PenalitiesService } from './chat/services/penalities/penalities.service';
import { UserService } from './user/user.service';
import { FriendsService } from './friends/friends.service';
import { MainGateway } from './main.gateway';
import { MessageService } from './message/message.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    HttpModule,
    JwtModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ChatModule,
    ConnectedUsersModule,
  ],
  controllers: [AuthController, UserController],
  providers: [
    PrismaService,
    ChatService,
    WschatService,
    PenalitiesService,
    UserService,
    FriendsService,
    MainGateway,
    MessageService,
  ],
})
export class AppModule {}
