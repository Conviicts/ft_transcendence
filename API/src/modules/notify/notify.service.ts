import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { UserState } from '../users/interfaces/user-state.interface';

@Injectable()
export class NotifyService {
  @WebSocketServer()
  server: Server;

  emitStatus(userId: string, status: UserState): void {
    this.server.emit('status', { userId, status });
  }
}
