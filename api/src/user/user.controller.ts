import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Put,
  Post,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendRequest, User } from '@prisma/client';
import { FriendsService } from 'src/friends/friends.service';
import {
  FriendRequestAction,
  FriendRequestDto,
  sendFriendRequestDto,
} from './dto/friend.dto';
import { updateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { IBasicUser } from './interfaces/user.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly friendsService: FriendsService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getOnlineUser(@Request() req: any) {
    return await this.userService.findOne(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req, @Param('id') id: number): Promise<IBasicUser> {
    return this.userService.getBasicUser(Number(id));
  }
  @Get('/profile/:id')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req, @Param('id') id: number): Promise<any> {
    return this.userService.getProfileUser(Number(id));
  }

  @Get('search/:name')
  @UseGuards(JwtAuthGuard)
  async findUserByName(@Param('name') name: string): Promise<User[]> {
    return await this.userService.findByName(name);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Request() req: any,
    @Body(new ValidationPipe()) data: updateUserDto,
  ) {
    return await this.userService.updateUser(req.user.id, data);
  }

  @Get('friends/get')
  @UseGuards(JwtAuthGuard)
  async getFriends(@Request() req: any): Promise<User[]> {
    return await this.friendsService.getFriends(req.user.id);
  }

  @Get('friends/pending')
  @UseGuards(JwtAuthGuard)
  async getFriendsPending(@Request() req: any): Promise<FriendRequest[]> {
    return await this.friendsService.getFriendRequests(req.user.id);
  }
  @Get('friends/accept/:id')
  @UseGuards(JwtAuthGuard)
  async acceptFriend(@Request() req: any, @Param('id') id: any) {
    const request = await this.friendsService.getFriendsRequestsById(id);

    if (request) {
      if (request.toId == req.user.id) {
        await this.friendsService.acceptFriend(id);
        return { message: 'Friend request accepted', state: 'success' };
      } else
        return { message: 'You are not the receiver of this friend request' };
    }
  }

  @Post('friends/decline/:id')
  @UseGuards(JwtAuthGuard)
  async declineFriend(@Request() req: any, @Param('id') id: number) {
    this.friendsService.declineFriend(id);
  }

  @Post('friends/request')
  @UseGuards(JwtAuthGuard)
  async newRequest(@Request() req: any, @Body() data: sendFriendRequestDto) {
    if (req.user.id == data.toId)
      return { message: "You can't add yourself as a friend", state: 'error' };
    if (await this.friendsService.haveFriend(req.user.id, Number(data.toId)))
      return { message: 'You are already friends', state: 'error' };
    if (
      await this.friendsService.haveFriendRequest(
        req.user.id,
        Number(data.toId),
      )
    )
      return { message: 'You already have a friend request', state: 'error' };
    if (await this.userService.isBlocked(req.user.id, Number(data.toId)))
      return { message: 'Request failed', state: 'error' };
    return await this.friendsService.addFriend(req.user.id, Number(data.toId));
  }

  @Get('friends/remove/:id')
  @UseGuards(JwtAuthGuard)
  async removeFriend(@Request() req: any, @Param('id') id: number) {
    return await this.friendsService.removeFriend(req.user.id, id);
  }

  @Post('friends')
  @UseGuards(JwtAuthGuard)
  async getFriendsByIds(@Request() req: any, @Body() data: FriendRequestDto) {
    const request = await this.friendsService.getFriendsRequestsById(
      data.requestId,
    );

    if (request) {
      if (request.toId == req.user.id) {
        if (data.action == FriendRequestAction.ACCEPT) {
          await this.friendsService.acceptFriend(request.id);
          return { message: 'Friend request accepted', state: 'success' };
        }
        if (data.action == FriendRequestAction.DECLINE) {
          await this.friendsService.declineFriend(request.id);
          return { message: 'Friend request declined', state: 'success' };
        }
      } else
        return { message: 'You are not the receiver of this friend request' };
    }
  }

  @Post('block/:id')
  @UseGuards(JwtAuthGuard)
  async block(@Request() req: any, @Param('id') target: number) {
    if (req.user.id == target)
      return { message: "You can't block yourself", state: 'error' };
    if (await this.friendsService.haveFriend(req.user.id, target))
      this.friendsService.removeFriend(req.user.id, target);
    await this.friendsService.haveFriendRequest(req.user.id, target, true);
    return await this.userService.blockUser(req.user.id, target);
  }

  @Post('unblock/:id')
  @UseGuards(JwtAuthGuard)
  async unblock(@Request() req: any, @Param('id') target: number) {
    return await this.userService.unblockUser(req.user.id, target);
  }
}
