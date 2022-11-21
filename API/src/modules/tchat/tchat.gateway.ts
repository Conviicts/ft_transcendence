/* eslint-disable @typescript-eslint/ban-types */
import { Logger, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/tchat',
  cors: { origin: process.env.FRONT_URI, credentials: true },
})
export class TchatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
  ) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('TchatGateway');

  async onModuleInit() {
  }


  async handleConnection(client: Socket) {
    
  }

  async handleDisconnect(client: Socket) {

  }
}
