import { Logger, OnModuleInit, UnauthorizedException, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { ChannelService } from './services/channel.service'
import { MessageService } from './services/message.service';
import { ConnectedUserService } from './services/connected-user.service';
import { JoinedChannelService } from './services/joined-channel.service';
import { UserRoleService } from './services/user-role.service';
import { UserConnected } from './guards/user-connected.guard';
import { UserState } from '../users/interfaces/user-state.interface';
import { IChannel } from "./interfaces/channel.interface";
import { IMessage } from './interfaces/message.interface';
import { IUserConnected } from '../users/interfaces/user.interface';
import { IJoinedChannel } from './interfaces/channel.interface';
import { IUserRole } from '../users/interfaces/user.interface';

import { UserService } from '../users/user.service';

@WebSocketGateway({ namespace: '/tchat', cors: { origin: process.env.FRONT_URI, credentials: true }})
export class TchatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
    private readonly connectedUserService: ConnectedUserService,
    private readonly messageService: MessageService,
    private readonly joinedChannelService: JoinedChannelService,
    private readonly userRoleService: UserRoleService,
  ) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('TchatGateway');

  async onModuleInit() {
      await this.connectedUserService.deleteAll();
      await this.joinedChannelService.deleteAll();
  }

  async userStatus() {
    let userID = await this.connectedUserService.userStatus();
    return this.server.emit('userConnected', userID);
}

  async handleConnection(client: Socket) {
    try {
      const user: User = await this.channelService.getUser(client);
      if (!user) {
          return this.handleDisconnect(client);
      } else {
        await this.connectedUserService.create({ socketId: client.id, user });
        this.userStatus();
        await this.sendChannelToConnectedUsers();
        this.logger.log(`Client connected: ${client.id}`);
      }
    } catch {
        return this.handleDisconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
      await this.connectedUserService.deleteUser(client.id);
      client.disconnect();
      this.userStatus();
      this.logger.log(`Client disconnected: ${client.id}`);
  }

  async sendChannelToConnectedUsers() {
    const connections: IUserConnected[] = await this.connectedUserService.findAll();
    for (const connection of connections) {
        const channels: IChannel[] = await this.channelService.getUserChannels(connection.user.userId);
        await this.server.to(connection.socketId).emit('channel', channels);
    }
}

  @UseGuards(UserConnected)
  @SubscribeMessage('createChannel')
  async onCreateChannel(client: Socket, channel: IChannel): Promise<boolean> {
    const user: User = await this.channelService.getUser(client);
    const newChannel: IChannel = await this.channelService.createChannel(channel, user);
    if (!newChannel) {
        return false;
    } else {
        await this.sendChannelToConnectedUsers();
        return true;
    }
  }
}
