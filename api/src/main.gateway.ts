import { Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat/chat.service';
import { UserService } from './user/user.service';
import { OnEvent } from '@nestjs/event-emitter';
import { RequestEvent } from './friends/interfaces/friends.event';
import { ConnectedUsersService } from './connected-users/connected-users.service';
import { IBasicUser } from './user/interfaces/user.interface';

@WebSocketGateway(3001, { cors: { origin: 'http://localhost:4200' } })
export class MainGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(ChatService) private readonly chatService: ChatService,
    private readonly connectedUsersService: ConnectedUsersService,
  ) {}

  handleConnection(client: Socket) {
    this.connectedUsersService.newConnect(client);
  }

  handleDisconnect(client: any) {
    this.connectedUsersService.deleteUser(client.id);
  }

  @OnEvent('friend.request')
  async handleFriendRequest(data: RequestEvent) {
    if (data.success) {
      this.sendToUser(
        data.user,
        'notification',
        "Vous avez envoyé une demande d'amitié à " + data.target.username,
      );
      this.sendToUser(
        data.target,
        'notification',
        data.user.username + " vous a envoyé une demande d'amitié",
      );
    } else {
      this.sendToUser(
        data.user,
        'notification',
        "Impossible d'envoyer la demande d'amitié. " + data.message,
      );
    }
  }

  @SubscribeMessage('whoami')
  async whoami(client: Socket) {
    const user = this.connectedUsersService.getUser(client.id);
    if (user) {
      this.server.emit(
        client.id,
        'whoami',
        await this.userService.findOne(user.id),
      );
    }
  }

  sendToUser(user: IBasicUser, prefix: string, data: any) {
    if (user) {
      for (const [key, value] of this.connectedUsersService.onlineUsers) {
        if (value.id == user.id) {
          this.server.to(key).emit(prefix, data);
        }
      }
    }
  }

  async sendToUsersInRoom(roomId: number, prefix: string, data: any) {
    const room = await this.chatService.getRoomById(roomId);

    room.users.forEach((user) => {
      this.sendToUser(user, prefix, data);
    });
  }
}
