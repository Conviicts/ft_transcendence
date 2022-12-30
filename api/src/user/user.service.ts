import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Prisma, FriendRequest, User, UserState } from '@prisma/client';
import { ConnectedUsersService } from 'src/connected-users/connected-users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { createIntraUserDto, updateUserDto } from './dto/user.dto';
import {
  GameUser,
  IBasicUser,
  IDataPlayer,
  IUserInfo,
} from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ConnectedUsersService))
    private connectedUsersService: ConnectedUsersService,
  ) {}

  async newUser(data: any): Promise<User> {
    try {
      const user = await this.prisma.user.create({ data });
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          throw new HttpException(
            e.meta.target[0] + ' already used',
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createIntraUser(user: createIntraUserDto): Promise<User> {
    let newUser: User;

    try {
      newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          intra_name: user.intra_name,
          intra_id: user.intra_id,
          avatar: user.avatar,
          username: user.username,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          throw new HttpException(
            e.meta.target[0] + ' already used',
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return newUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: number): Promise<IUserInfo> {
    const user: IUserInfo = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        state: true,
        username: true,
        intra_name: true,
        email: true,
        avatar: true,
        friends: {
          select: {
            id: true,
            state: true,
            username: true,
            intra_name: true,
            email: true,
            avatar: true,
          },
        },
        friendOf: true,
        games: {
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            winnerId: {
              not: null,
            },
            loserId: {
              not: null,
            },
          },
          select: {
            id: true,
            users: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            winner: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            loser: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            winnerScore: true,
            loserScore: true,
          },
        },
        blockedUsers: true,
        TFAEnabled: true,
        createdAt: true,
        updatedAt: true,
        score: true,
        _count: {
          select: {
            games_win: true,
            games_lose: true,
            games: true,
          },
        },
      },
    });
    if (!user) return null;
    user.leaderboard_pos = await this.getLeaderboardPosition(user.id);
    return user;
  }

  async findByEmail(iemail: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({
      where: {
        email: String(iemail),
      },
    });
  }

  async getDataPlayer(id: number): Promise<IDataPlayer> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        username: true,
        intra_name: true,
      },
    });
    return user;
  }

  async findByName(name: string): Promise<any> {
    const users = await this.prisma.user.findMany({
      where: {
        intra_name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        intra_name: true,
        email: true,
        avatar: true,
        username: true,
      },
    });
    return users;
  }

  async getProfileUser(userId: number): Promise<any> {
    if (!userId) return null;
    const user: any = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        state: true,
        intra_name: true,
        username: true,
        email: true,
        avatar: true,
        score: true,
        games: {
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            winnerId: {
              not: null,
            },
            loserId: {
              not: null,
            },
          },
          include: {
            winner: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            loser: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            games_win: true,
            games_lose: true,
            games: true,
          },
        },
      },
    });
    user.leaderboard_pos = await this.getLeaderboardPosition(user.id);
    if (user === undefined) return null;
    return user;
  }

  async getBasicUser(userId: number): Promise<IBasicUser> {
    if (!userId) return null;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        state: true,
        intra_name: true,
        username: true,
        email: true,
        avatar: true,
        score: true,
        _count: {
          select: {
            games_win: true,
            games_lose: true,
            games: true,
          },
        },
      },
    });
    if (user === undefined) return null;
    return user;
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

  async set2FASsecret(userId: number, secret: string) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        TFASecret: secret,
      },
    });
  }

  async get2FASsecret(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        TFASecret: true,
      },
    });
    return user.TFASecret;
  }

  async set2FAEnable(userId: number, enable: boolean) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        TFAEnabled: enable,
      },
    });
    return {
      message: enable ? '2FA enabled' : '2FA disabled',
    };
  }

  async updateUser(id: string, update: updateUserDto) {
    try {
      await this.prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          username: update.username,
          avatar: update.avatar,
        },
      });
      return {
        message: 'User was been updated',
      };
    } catch (unique: any) {
      if (unique.code === 'P2002') {
        throw new HttpException(
          unique.meta.target[0] + ' already used',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(unique, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async setState(userId: number, status: UserState) {
    if (userId && status) {
      await this.prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          state: status,
        },
      });
    }
  }

  async setStates(users: GameUser[], status: UserState) {
    if (users && status) {
      for (const user of users) {
        const loggedUser: boolean =
          this.connectedUsersService.getUser(null, user.id) !== undefined;
        await this.prisma.user.update({
          where: {
            id: Number(user.id),
          },
          data: {
            state: loggedUser ? status : UserState.OFFLINE,
          },
        });
      }
    }
  }

  async getFriends(userId: number): Promise<IBasicUser[]> {
    const user: any = await this.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        friends: {
          select: {
            id: true,
            state: true,
            username: true,
            intra_name: true,
            email: true,
            avatar: true,
            score: true,
            _count: {
              select: {
                games_win: true,
                games_lose: true,
                games: true,
              },
            },
          },
          orderBy: {
            state: 'desc',
          },
        },
      },
    });

    for (const friend of user.friends) {
      friend.leaderboard_pos = await this.getLeaderboardPosition(friend.id);
    }
    return user.friends;
  }

  async getLeaderboardPosition(userId: number): Promise<number> {
    const leaderboard = await this.prisma.user.findMany({
      orderBy: {
        score: 'desc',
      },
      select: {
        id: true,
      },
    });
    return leaderboard.findIndex((user) => user.id === userId) + 1;
  }

  /**
   * Blocked user
   */

  async isBlocked(userId: number, targetId: number): Promise<boolean> {
    const blocked = await this.prisma.user.findFirst({
      where: {
        id: Number(targetId),
        blockedBy: {
          some: {
            id: userId,
          },
        },
      },
    });
    return blocked != null;
  }

  async blockUser(userId: number, blockedId: number) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        blockedUsers: {
          connect: {
            id: Number(blockedId),
          },
        },
      },
    });
    return { message: 'User blocked', state: 'success' };
  }

  async unblockUser(userId: number, blockedId) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        blockedUsers: {
          disconnect: {
            id: Number(blockedId),
          },
        },
      },
    });
    return { message: 'User unblocked', state: 'success' };
  }

  async disconnectAll() {
    await this.prisma.user.updateMany({
      data: {
        state: UserState.OFFLINE,
      },
    });
  }

  async getBlocked(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        blockedUsers: true,
      },
    });
    return user.blockedUsers;
  }
}
