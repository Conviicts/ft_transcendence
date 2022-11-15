import { Socket } from 'socket.io';
import { User } from 'src/modules/users/entities/user.entity';

import { UserState } from '../../users/interfaces/user-state.interface';

export interface Player {
  socket: Socket;
  user: User;
  room: Room;
  tray: number;
  score: number;
}

export interface Position {
  x: number;
  y: number;
}

interface Ball {
  position: Position;
  velocity: Position;
}

export interface Room {
  code: string;
  state: UserState;
  players: Array<Player>;
  spectators?: Array<Socket>;
  ball: Ball;
  speed: number;
}
