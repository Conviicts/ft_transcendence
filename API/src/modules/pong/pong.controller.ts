import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PongService } from './pong.service';
import { UserGuard } from '../users/guards/user.guard';
import { AdminGuard } from '../users/guards/admin.guard';
import { PongGame } from './entities/pong.entity';

@ApiTags('pong')
@Controller('api/pong')
export class PongController {
  constructor(
    private pongService: PongService
  ) {}

  @ApiOperation({summary: 'Get all pong games'})
  @ApiOkResponse({description: 'returns all pong games'})
  @UseGuards(AuthGuard('jwt'), UserGuard, AdminGuard)
  @Get('/')
  getAllGames(): Promise<PongGame[]> {
    return this.pongService.getAllGames();
  }
}
