import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Socket } from 'socket.io';

import { UserService } from '../../users/user.service';
import { Room } from '../interfaces/room.interface';

import { PongService } from '../pong.service';

@Injectable()
export class RoomService {
  constructor(
    private readonly pong: PongService,
    private readonly userService: UserService,
  ) {}

  queue: Array<Socket> = [];
  rooms: Map<string, Room> = new Map();

  async removeSocket(socket: Socket): Promise<any> {
    if (this.queue.indexOf(socket) != -1)
      return this.queue.splice(this.queue.indexOf(socket), 1);

    for (const room of this.rooms.values()) {
      if (room.spectators && room.spectators.indexOf(socket) != -1)
        return room.spectators.splice(room.spectators.indexOf(socket), 1);

      for (const player of room.players)
        if (player.socket.id == socket.id) {
          // TODO: remove current game
          room.players.splice(room.players.indexOf(player), 1);
          break;
        }
      if (!room.players.length) return this.rooms.delete(room.code);
    }
  }
}
