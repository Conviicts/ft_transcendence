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

      const user_channels = await this.publicChannelService.getChannels(
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
}
