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

@ApiTags('Users')
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
  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'User is logged out' };
  }
}
