/* eslint-disable @typescript-eslint/no-unused-vars */
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
  UploadedFile,
  UseInterceptors,
  Param,
  ParseUUIDPipe,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { UserGuard } from '../guards/user.guard';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { NewUserDTO, LoginUserDTO, UpdateUserDTO } from '../dto/user.dto';
import { Readable } from 'typeorm/platform/PlatformTools';

@ApiTags('Users')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'User sign-up' })
  @ApiOkResponse({ description: 'Provide you an access token' })
  @ApiConflictResponse({ description: 'Username or email already exist' })
  @Post('/signup')
  async signUp(
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
  @Post('/signin')
  async signIn(
    @Body() userData: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    return this.userService.login(userData, res);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Provide you list of all users' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getAllUsers(): Promise<Partial<User[]>> {
    const users = await this.userService.getAllUsers();
    const userRet = [];
    users.forEach((user) => {
      const { password, ...newUser } = user;
      userRet.push(newUser);
    });
    return userRet;
  }

  @ApiOperation({ summary: 'Get all info of current user' })
  @ApiOkResponse({ description: 'Provide you your user information' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Get('/me')
  me(@Req() req): Promise<Partial<User>> {
    return this.userService.currentUser(req.user.uid);
  }

  @ApiOperation({ summary: 'Check if 2FA is activated' })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Get('/2fa')
  get2FA(@Req() req): boolean {
    const user: User = req.user;
    return this.userService.get2FA(user);
  }

  @ApiOperation({ summary: 'Update Two Factor Auth' })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      properties: {
        toggle: {
          type: 'boolean',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Patch('/2fa')
  update2FA(
    @Body('toggle') bool: boolean,
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    const user: User = req.user;
    return this.userService.update2FA(bool, user, res);
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
    summary: 'Update user avatar',
    description: 'Update avatar of current useer',
  })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Patch('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  updateAvatar(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return this.userService.setAvatar(req.user.uid, file);
  }

  @ApiOperation({ summary: 'Logs you out' })
  @ApiOkResponse({ description: 'Confirms that you have logged out' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'User is logged out' };
  }

  @ApiOperation({ summary: 'Get user avatar' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/avatar')
  async getAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const avatar = await this.userService.getAvatar(id);
    response.set({
      'Content-Disposition': `inline; filename="${avatar.name}"`,
      'Content-Type': 'image/*',
    });
    return new StreamableFile(Readable.from(avatar.data));
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiUnauthorizedResponse({
    description: "You don't have access to this",
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Partial<User>> {
    const user = await this.userService.getUserById(id);
    const { password, ...newUser } = user;
    return newUser;
  }
}
