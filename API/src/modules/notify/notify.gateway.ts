import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserState } from '../users/interfaces/user-state.interface';

import { UserService } from '../users/services/user.service';
import { NotifyService } from './notify.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_URI,
    credentials: true,
  },
  namespace: '/notify',
})
export class NotifyGateway {
  constructor(
    private readonly userService: UserService,
    private readonly notifyService: NotifyService,
  ) {}
  @WebSocketServer()
  server: any;

  afterInit(server: Server): void {
    this.notifyService.server = server;
  }

  async handleConnection(client: Socket): Promise<any> {
    try {
      const user = await this.userService.getUserBySocket(client);
      if (!user) return client.disconnect();
      await this.userService.updateStatus(UserState.ONLINE, user.uid);
      client.data.user = user;
    } catch {}
  }

  async handleDisconnect(client: Socket): Promise<void> {
    try {
      if (!client.data.user) return;

      const userId = client.data.user.uid;

      const socket: any = Array.from(this.server.sockets.values()).find(
        (socket: Socket) => socket.data.user.uid == userId,
      );
      if (socket) return;

      const user = await this.userService.getUser(userId);
      if (!user) return;

      if (user.status == UserState.ONLINE)
        await this.userService.updateStatus(UserState.OFFLINE, user.uid);
    } catch {}
  }

  @SubscribeMessage('notify')
  handleNotify(client: Socket, data: any): void {
    try {
      const user = client.data.user;
      if (!user) return;

      const socket: any = Array.from(this.server.sockets.values()).find(
        (socket: Socket) => socket.data.user.uid == data.uid,
      );
      if (!socket) client.emit('error', 'User not found');
      else {
        data.uid = user.uid;
        socket.emit('notify', data);
      }
    } catch {}
  }
}
