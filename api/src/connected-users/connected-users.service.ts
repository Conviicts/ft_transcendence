import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketServer } from '@nestjs/websockets';
import { UserState } from '@prisma/client';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { IBasicUser, IDataPlayer } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ConnectedUsersService {
  handleConnection(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    throw new Error('Method not implemented.');
  }

  public onlineUsers: Map<string, IBasicUser> = new Map<string, IBasicUser>();

  @WebSocketServer() server;

  constructor(
    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async initUser(socketId: string, user: IBasicUser) {
    this.onlineUsers.forEach((value, key) => {
      if (value.id == user.id) {
        this.onlineUsers.delete(key);
      }
    });
    this.onlineUsers.set(socketId, user);
    this.userService.setState(user.id, UserState.ONLINE);
  }

  async newConnect(socket: Socket): Promise<IBasicUser> {
    try {
      const token = socket.handshake.query['token'] as string;
      const res = this.jwtService.verify(token, {
        ignoreExpiration: false,
        secret: process.env.SESSION_SECRET,
      });
      const user = await this.userService.findOne(res.sub);
      if (!user) {
        socket.disconnect();
        return null;
      }
      this.initUser(socket.id, user);
      socket.data.user = user;
      return user;
    } catch (error) {
      socket.disconnect();
      return null;
    }
  }

  getUser(
    socketId?: string,
    userId?: number,
    basicUser?: IBasicUser,
  ): IBasicUser {
    if (socketId) {
      return this.onlineUsers.get(socketId);
    }
    if (userId) {
      for (const [, value] of this.onlineUsers) {
        if (value.id == userId) return value;
      }
    }
    if (basicUser) {
      for (const [, value] of this.onlineUsers) {
        if (value.id == basicUser.id) return value;
      }
    }
  }

  getDataPlayer(clientId: string): IDataPlayer {
    const user = this.getUser(clientId);
    if (user) {
      return {
        id: user.id,
        username: user.username,
        intra_name: user.intra_name,
      };
    }
    return null;
  }

  getDataPlayerById(id: number): IDataPlayer {
    const user = this.getUser(null, id);
    if (user) {
      return {
        id: user.id,
        username: user.username,
        intra_name: user.intra_name,
      };
    }
    return null;
  }

  sendToUser(user: IBasicUser | number, event: string, data: any) {
    const userId = typeof user == 'number' ? user : user.id;

    for (const [key, value] of this.onlineUsers) {
      if (value.id == userId) {
        this.server.to(key).emit(event, data);
      }
    }
  }

  sendToUsers(users: IBasicUser[], event: string, data: any) {
    for (const user of users) {
      this.sendToUser(user, event, data);
    }
  }

  setCurrentRoom(socketId: string, roomId: number) {
    const user = this.getUser(socketId);
    if (user) {
      user.inRoomId = roomId;
      this.onlineUsers.delete(socketId);
      this.onlineUsers.set(socketId, user);
    }
  }

  deleteUser(socketId: string) {
    const user = this.onlineUsers.get(socketId);
    if (user) {
      this.userService.setState(user.id, UserState.OFFLINE);
    }
    this.onlineUsers.delete(socketId);
  }
}
