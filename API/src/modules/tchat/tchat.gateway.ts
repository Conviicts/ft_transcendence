/* eslint-disable @typescript-eslint/ban-types */
import { Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { User } from '../users/entities/user.entity';
import { ChannelService } from './services/channel.service';
import { MessageService } from './services/message.service';
import { ConnectedUserService } from './services/connected-user.service';
import { JoinedChannelService } from './services/joined-channel.service';
import { UserRoleService } from './services/user-role.service';
import { UserConnected } from './guards/user-connected.guard';
import { IChannel, IJoinedChannel } from './interfaces/channel.interface';
import { IUserConnected } from '../users/interfaces/user.interface';

import { UserService } from '../users/services/user.service';
import { IMessage } from './interfaces/message.interface';

@WebSocketGateway({
  namespace: '/tchat',
  cors: { origin: process.env.FRONT_URI, credentials: true },
})
export class TchatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
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
    const userID = await this.connectedUserService.userStatus();
    return this.server.emit('userConnected', userID);
  }

  async handleConnection(client: Socket) {
    try {
      const user: User = await this.channelService.getUser(client);
      if (!user) {
        return this.handleDisconnect(client);
      } else {
        client.data.user = user;
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
    const connections: IUserConnected[] =
      await this.connectedUserService.findAll();
    for (const connection of connections) {
      const channels: IChannel[] = await this.channelService.getUserChannels(
        connection.user.userId,
      );
      await this.server.to(connection.socketId).emit('channel', channels);
    }
  }

  @UseGuards(UserConnected)
  @SubscribeMessage('createChannel')
  async onCreateChannel(client: Socket, channel: IChannel): Promise<boolean> {
    const user: User = await this.channelService.getUser(client);
    const newChannel: IChannel = await this.channelService.createChannel(
      channel,
      user,
    );
    if (!newChannel) {
      return false;
    } else {
      await this.sendChannelToConnectedUsers();
      return true;
    }
  }

  @UseGuards(UserConnected)
  @SubscribeMessage('getChannel')
  async onChatPage(client: Socket): Promise<IChannel[]> {
    const user: User = await this.channelService.getUser(client);
    const channels: IChannel[] = await this.channelService.getUserChannels(
      user.userId,
    );
    return channels;
  }

  @UseGuards(UserConnected)
  @SubscribeMessage('deleteChannel')
  async onDeleteChannel(client: Socket, channel: IChannel) {
    await this.channelService.deleteChannel(channel);
    await this.sendChannelToConnectedUsers();
  }

  @UseGuards(UserConnected)
  @SubscribeMessage('leaveChannel')
  async onLeaveChannel(client: Socket, data: any) {
    const { channel, user } = data;
    await this.channelService.leaveChannel(channel, user);
    await this.sendChannelToConnectedUsers();
  }

  @UseGuards(UserConnected)
  @SubscribeMessage('updateChannel')
  async onUpdateChannel(client: Socket, info: any): Promise<boolean> {
    const { channel } = info;
    const channelFound = await this.channelService.getChannel(
      channel.channelId,
    );

    const ret: Boolean = await this.channelService.updateChannel(
      channelFound,
      info.data,
    );
    if (ret === true) {
      await this.sendChannelToConnectedUsers();
      return true;
    }
    return false;
  }

  @UseGuards(UserConnected)
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, channel: IChannel) {
    const channelFound = await this.channelService.getChannel(
      channel.channelId,
    );
    if (
      channelFound.isPublic === false &&
      (await this.channelService.isPrivateChannel(
        channelFound,
        client.data.user,
      )) == false
    ) {
      return;
    }
    const messages = await this.messageService.findChannelMessages(
      channelFound,
    );
    await this.joinedChannelService.create({
      socketId: client.id,
      user: client.data.user,
      channel,
    });
    await this.server.to(client.id).emit('messages', messages);
  }

  @UseGuards(UserConnected)
  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(client: Socket) {
    await this.joinedChannelService.deleteBySocketId(client.id);
  }

  @UseGuards(UserConnected)
  @SubscribeMessage('addMessage')
  async onAddMessage(client: Socket, message: IMessage) {
    const userFound = await this.userRoleService.findUserByChannel(
      message.channel,
      client.data.user.userId,
    );
    const date = new Date();
    if (userFound && (userFound.mute >= date || userFound.ban >= date)) return;
    const newMessage: IMessage = await this.messageService.create({
      ...message,
      user: client.data.user,
    });
    const channel: IChannel = await this.channelService.getChannel(
      newMessage.channel.channelId,
    );
    const joinedUsers: IJoinedChannel[] =
      await this.joinedChannelService.findByChannel(channel);

    const originalMessage = newMessage.content;
    for (const user of joinedUsers) {
      newMessage.content = originalMessage;

      const userRole = await this.userRoleService.findUserByChannel(
        message.channel,
        user.user.userId,
      );
      const date = new Date();
      if (
        !userRole ||
        userRole.ban < date ||
        userRole.ban === null ||
        userRole.mute >= date
      ) {
        await this.server.to(user.socketId).emit('messageAdded', newMessage);
      }
    }
  }

  @UseGuards(UserConnected)
  @SubscribeMessage('restrictUser')
  async onRestrictUser(client: Socket, data: any): Promise<User> {
    const { user, toggle } = data;
    const userUpdate = this.userService.updateRestrictedUsers(
      toggle,
      client.data.user,
      user,
    );
    return userUpdate;
  }
}
