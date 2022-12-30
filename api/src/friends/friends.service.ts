import { Injectable } from '@nestjs/common';
import { FriendRequest, FriendStatus } from '@prisma/client';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private chatService: ChatService,
  ) {}

  async addFriend(userId: number, friendId: number) {
    await this.prisma.friendRequest.create({
      data: {
        from: {
          connect: {
            id: userId,
          },
        },
        to: {
          connect: {
            id: friendId,
          },
        },
        status: FriendStatus.PENDING,
      },
    });
    return { message: 'Friend request sent', state: 'success' };
  }

  async acceptFriend(requestIs: number) {
    const request: any = await this.prisma.friendRequest.update({
      where: {
        id: Number(requestIs),
      },
      data: {
        status: FriendStatus.ACCEPTED,
      },
    });
    await this.prisma.user.update({
      where: {
        id: request.fromId,
      },
      data: {
        friends: {
          connect: {
            id: request.toId,
          },
        },
        friendOf: {
          connect: {
            id: request.toId,
          },
        },
      },
    });
    this.chatService.creatDm(request.fromId, request.toId);
    return { message: 'Friend request accepted', state: 'error' };
  }

  async declineFriend(requestIs: number) {
    await this.prisma.friendRequest.update({
      where: {
        id: Number(requestIs),
      },
      data: {
        status: FriendStatus.DECLINED,
      },
    });
    return { message: 'Friend request declined' };
  }

  async getFriendRequests(userId: number): Promise<FriendRequest[]> {
    const users: FriendRequest[] = await this.prisma.friendRequest.findMany({
      where: {
        toId: Number(userId),
        status: FriendStatus.PENDING,
      },
      include: {
        from: {
          select: {
            id: true,
            intra_name: true,
            avatar: true,
            username: true,
          },
        },
        to: {
          select: {
            id: true,
            intra_name: true,
            avatar: true,
            username: true,
          },
        },
      },
    });
    return users;
  }

  async getFriends(userID: number): Promise<any[]> {
    const friends: any = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            friends: {
              some: {
                id: userID,
              },
            },
          },
          {
            friendOf: {
              some: {
                id: userID,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        state: true,
        intra_name: true,
        email: true,
        avatar: true,
        username: true,
      },
    });
    for (const friend of friends) {
      friend.position_in_leaderboard =
        await this.userService.getLeaderboardPosition(friend.id);
    }
    return friends;
  }

  async getFriendsRequestsById(requestId: number): Promise<FriendRequest> {
    const request = await this.prisma.friendRequest.findUnique({
      where: {
        id: Number(requestId),
      },
      include: {
        from: true,
        to: true,
      },
    });
    return request;
  }

  async removeFriend(userId: number, friendId: number) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        friends: {
          disconnect: {
            id: Number(friendId),
          },
        },
        friendOf: {
          disconnect: {
            id: Number(friendId),
          },
        },
      },
    });
    this.chatService.deleteDm(userId, friendId);
  }

  async haveFriend(userId: number, friendId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        friends: {
          where: {
            id: Number(friendId),
          },
        },
        friendOf: {
          where: {
            id: Number(friendId),
          },
        },
      },
    });
    return user.friends.length > 0 || user.friendOf.length > 0;
  }

  async haveFriendRequest(
    userId: number,
    friendId: number,
    decline?: boolean,
  ): Promise<boolean> {
    const requests = await this.prisma.friendRequest.findMany({
      where: {
        status: FriendStatus.PENDING,
        OR: [
          {
            fromId: Number(userId),
            toId: Number(friendId),
          },
          {
            fromId: Number(friendId),
            toId: Number(userId),
          },
        ],
      },
    });
    if (requests.length > 0 && decline) this.declineFriend(requests[0].id);
    return requests.length > 0;
  }
}
