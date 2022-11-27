/* eslint-disable @typescript-eslint/ban-types */
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as bcrypt from 'bcrypt';

import { UserState } from '../users/interfaces/user-state.interface';
import { UserService } from '../users/services/user.service';
import { PublicChannel } from './entities/public-channel.entity';
import { PrivateMessageService } from './services/private-message.service';
import { PublicChannelService } from './services/public-channel.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/tchat',
  cors: { origin: process.env.FRONT_URI, credentials: true },
})
export class TchatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly userService: UserService,
    private readonly publicChannelService: PublicChannelService,
    private readonly privateMessageService: PrivateMessageService,
  ) {}

  @WebSocketServer()
  server: any;

  async handleConnection(client: Socket) {
    try {
      const user = await this.userService.getUserBySocket(client);
      if (!user) return client.disconnect();

      await this.userService.updateStatus(UserState.CHATTING, user.uid);

      const user_channels = await this.publicChannelService.getUserChannels(
        user.uid,
      );
      const private_channels = await this.privateMessageService.getChannels(
        user.uid,
      );

      const all_channels = await this.publicChannelService.getAllChannels();

      client.data.user = user;

      client.emit('channels', {
        user,
        user_channels,
        all_channels,
        private_channels,
      });
    } catch {}
  }

  async handleDisconnect(client: Socket) {
    try {
      if (!client.data.user) return;

      return this.userService.updateStatus(
        UserState.ONLINE,
        client.data.user.uid,
      );
    } catch {}
  }

  sendChannel(channel: any, event: string, ...args: any): void {
    try {
      if (!channel.users) return;

      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (channel.users.find((user) => user.id == socket.data.user.id))
          socket.emit(event, ...args);
      });
    } catch {}
  }

  @SubscribeMessage('joinchannel')
  async joinChannel(client: Socket, chan: PublicChannel): Promise<void> {
    try {
      let channel = await this.publicChannelService.getChannel(chan.id, true);
      if (!channel.public && chan.password)
        client.emit(
          'validpassword',
          bcrypt.compareSync(chan.password, channel.password),
        );

      await this.publicChannelService.addUserToChannel(
        chan,
        client.data.user.id,
      );

      channel = await this.publicChannelService.getChannel(channel.id);
      this.sendChannel(channel, 'join', { channel, user: client.data.user });
    } catch {}
  }

  @SubscribeMessage('leave')
  async leaveChannel(client: Socket, data: any): Promise<void> {
    try {
      let user = client.data.user;
      if (data.uid) user = await this.userService.getUser(data.uid);

      const channel = await this.publicChannelService.getChannel(
        data.channelId,
      );
      await this.publicChannelService.removeUserFromChannel(
        user.uid,
        data.channelId,
        client.data.user.uid,
      );

      const deleted = channel.owner.uid == user.uid ? true : false;
      this.sendChannel(channel, 'leavechannel', {
        channel,
        user,
        deleted: deleted,
      });
    } catch {}
  }

  @SubscribeMessage('channel')
  async getChannel(client: Socket, id: number): Promise<void> {
    try {
      const channel = await this.publicChannelService.getChannel(id);
      client.emit('channel', channel);
    } catch {}
  }

  @SubscribeMessage('mychannels')
  async getChannelMe(client: Socket): Promise<void> {
    try {
      const channels = await this.publicChannelService.getUserChannels(
        client.data.user.uid,
      );

      client.emit('mychannels', channels);
    } catch {}
  }

  @SubscribeMessage('addmessage')
  async handleMessage(client: Socket, data: any): Promise<void> {
    try {
      const user = client.data.user;
      const channel = await this.publicChannelService.getChannel(data.id);

      if (data.value.length >= 255)
        throw new HttpException('message is too long', HttpStatus.BAD_REQUEST);

      this.sendChannel(channel, 'addmessage', {
        user: { uid: user.uid, username: user.username },
        ...data,
      });
    } catch {}
  }

  @SubscribeMessage('newadmin')
  async addAdmin(client: Socket, data: any): Promise<void> {
    try {
      let channel = await this.publicChannelService.getChannel(data.channelId);
      const owner = client.data.user;
      const admin = await this.userService.getUser(data.userId);

      await this.publicChannelService.toogleAdmin(
        owner.uid,
        admin.uid,
        channel.id,
      );

      channel = await this.publicChannelService.getChannel(data.channelId);

      this.sendChannel(channel, 'newadmin', {
        channel: { id: channel.id, name: channel.name, admins: channel.admins },
        new_admin: { uid: admin.uid, username: admin.username },
      });
    } catch {}
  }

  @SubscribeMessage('mute')
  async muteUser(client: Socket, data: any): Promise<void> {
    try {
      let channel = await this.publicChannelService.getChannel(data.channelId);
      const target = await this.userService.getUser(data.uid);
      const admin = client.data.user;

      const muted = channel.muted.find((muted) => muted.user.uid == data.uid);

      if (muted) await this.publicChannelService.demuteUser(muted, channel);
      else
        await this.publicChannelService.muteUser(
          target.uid,
          channel.id,
          admin.uid,
        );

      channel = await this.publicChannelService.getChannel(data.channelId);

      this.sendChannel(channel, 'muteuser', {
        channel: { id: channel.id, name: channel.name, muted: channel.muted },
        user: { id: admin.id, username: admin.username },
        muted_user: { id: target.uid, username: target.username },
      });
    } catch {}
  }

  @SubscribeMessage('banuser')
  async banUser(client: Socket, data: any): Promise<void> {
    try {
      const channel = await this.publicChannelService.getChannel(
        data.channelId,
      );
      const target = await this.userService.getUser(data.uid);
      const admin = client.data.user;

      const banned = channel.banned.find(
        (banned) => banned.user.uid == data.user.id,
      );

      if (banned) await this.publicChannelService.debanUser(banned, channel);
      else
        await this.publicChannelService.banUser(
          target.uid,
          channel.id,
          admin.uid,
        );

      const newchan = await this.publicChannelService.getChannel(
        data.channelId,
      );

      this.sendChannel(channel, 'banuser', {
        channel: {
          id: channel.id,
          name: channel.name,
          banned: newchan.banned,
        },
        user: { id: admin.id, username: admin.username },
        banned_user: { id: target.uid, username: target.username },
      });
    } catch {}
  }

  @SubscribeMessage('getPrivateChannels')
  async getPrivateChannels(client: Socket): Promise<void> {
    try {
      const channels = await this.privateMessageService.getChannels(
        client.data.user.uid,
      );
      client.emit('getPrivateChannels', channels);
    } catch {}
  }

  @SubscribeMessage('joinPrivateChannel')
  async joinPrivateChannel(client: Socket, userId: string): Promise<void> {
    try {
      const channel = await this.privateMessageService.joinChannel(
        client.data.user.uid,
        userId,
      );
      this.sendChannel(channel, 'joinPrivateChannel');
    } catch {}
  }

  @SubscribeMessage('sendPrivateMessage')
  async sendPrivateMessage(client: Socket, data: any): Promise<void> {
    try {
      const channel = await this.privateMessageService.getChannel(
        data.channelId,
      );

      const other = channel.users.find(
        (user) => user.uid != client.data.user.uid,
      );
      if (other && other.restricted.includes(client.data.user.id))
        client.emit('blockeduser');

      if (data.text.length >= 255)
        throw new HttpException('message is too long', HttpStatus.BAD_REQUEST);

      const log = await this.privateMessageService.addMessage(
        channel.id,
        client.data.user.uid,
        data.text,
      );
      this.sendChannel(channel, 'sendPrivateMessage', {
        user: log.user,
        text: log.message,
        channelId: channel.id,
      });
    } catch {}
  }
}
