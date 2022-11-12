import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { TchatGateway } from '../tchat/tchat.gateway';
import { PongService } from './pong.service';

@WebSocketGateway({
  namespace: '/game',
  cors: { origin: process.env.FRONT_URI, credentials: true },
})
export class gameGateway {
  constructor(
    private chatGateway: TchatGateway,
    private pongService: PongService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('gameGateway');

  afterInit(server: Server) {
    this.logger.log('game gateway initated !');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Client connected: ' + client.handshake.query.username);
  }

  handleDisconnect(client: Socket) {}
}
