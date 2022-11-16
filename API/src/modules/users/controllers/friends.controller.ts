import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from '../guards/user.guard';
import { FriendsService } from '../services/friends.service';
import { User } from '../entities/user.entity';

@ApiTags('Friends')
@Controller('api/user')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiOperation({ summary: 'Get friends' })
  @ApiOkResponse({ description: 'get your friends list' })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Get('/friends')
  getFriendList(@Req() req): Promise<object> {
    const user: User = req.user;
    return this.friendsService.getFriendsList(user);
  }

  @ApiOperation({ summary: 'Add friend' })
  @ApiOkResponse({ description: 'user added to your friends' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      properties: {
        uid: {
          type: 'string',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Post('/friends')
  addFriend(@Body('uid') friend: string, @Req() req): Promise<void> {
    const user: User = req.user;
    return this.friendsService.addFriend(friend, user);
  }

  @ApiOperation({ summary: 'Delete friend' })
  @ApiOkResponse({ description: 'user deleted from your friends' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      properties: {
        uid: {
          type: 'string',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Delete('/friends')
  deleteFriend(@Body('uid') friend: string, @Req() req): Promise<void> {
    const user: User = req.user;
    return this.friendsService.deleteFriend(friend, user);
  }
}
