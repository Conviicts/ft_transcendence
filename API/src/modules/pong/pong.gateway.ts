import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { TchatGateway } from '../tchat/tchat.gateway';
import { UserService } from '../users/user.service';
import { UserState } from '../users/interfaces/user-state.interface';
import { RoomService } from './services/room.service';

@WebSocketGateway({
  namespace: '/game',
  cors: { origin: process.env.FRONT_URI, credentials: true },
})
export class gameGateway {
  constructor(
    private chatGateway: TchatGateway,
    private userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('gameGateway');

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    this.logger.log('Client connected: ' + client.handshake.query.username);
    try {
      const user = await this.userService.getUserBySocket(client);
      if (!user) return client.disconnect();

      await this.userService.updateStatus(UserState.INGAME, user.userId);
      client.data.user = user;
      client.emit('userdata', { user });
    } catch {}
  }

  async handleDisconnect(client: Socket): Promise<any> {
    try {
      if (!client.data.user) return;

      await this.roomService.removeSocket(client);
      await this.userService.updateStatus(
        UserState.ONLINE,
        client.data.user.id,
      );
    } catch {}
  }
}
