import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Patch,
  Delete,
  Res,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserGuard } from './guards/user.guard';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { NewUserDTO, LoginUserDTO, UpdateUserDTO } from './dto/user.dto';

@ApiTags('users')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'User sign-up' })
  @ApiOkResponse({ description: 'Provide you an access token' })
  @ApiConflictResponse({ description: 'Username or email already exist' })
  @Post('/register')
  async register(
    @Body() userData: NewUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    return this.userService.register(userData, res);
  }

  @ApiOperation({ description: 'User sign-in' })
  @ApiOkResponse({ description: 'Provide you an access token' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @Post('/login')
  async signIn(
    @Body() userData: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    return this.userService.login(userData, res);
  }

  @ApiOperation({ summary: 'Get all info of current user' })
  @ApiOkResponse({ description: 'Provide you your user information' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Get('/')
  me(@Req() req): Promise<Partial<User>> {
    const user: User = req.user;
    return this.userService.currentUser(user);
  }

  @ApiOperation({
    summary: 'Update user data',
    description: 'Update username, email or password',
  })
  @ApiOkResponse({ description: 'Provide you your updated user information' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Patch('/')
  updateUser(
    @Body() updateUser: UpdateUserDTO,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const user: User = req.user;
    return this.userService.updateUser(updateUser, user, res);
  }

  @ApiOperation({
    summary: 'delete user account',
    description: 'delete an user',
  })
  @ApiOkResponse({ description: 'Confirms that your account has been deleted' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Delete('/')
  deleteUser(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const user_id = req.user.userId;
    return this.userService.deleteUser(user_id, res);
  }

  @ApiOperation({ summary: 'Logs you out' })
  @ApiOkResponse({ description: 'Confirms that you have logged out' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'User is logged out' };
  }
}
