import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PongService } from './pong.service';
import { UserGuard } from '../users/guards/user.guard';
import { AdminGuard } from '../users/guards/admin.guard';
import { PongGame } from './entities/pong.entity';

@ApiTags('pong')
@Controller('api/pong')
export class PongController {
  constructor(private pongService: PongService) {}

  @ApiOperation({ summary: 'Get All Maps' })
  @ApiOkResponse({ description: 'returns a list of all available maps' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/maps')
  getAllMap(@Res() res): any {
    return res
      .set({ 'Cache-Control': ['public', 'max-age=604800', 'immutable'] })
      .json(this.pongService.getAllMaps());
  }

  @ApiOperation({ summary: 'Get all pong games' })
  @ApiOkResponse({ description: 'returns all pong games' })
  @UseGuards(AuthGuard('jwt'), UserGuard, AdminGuard)
  @Get('/')
  getAllGames(): Promise<PongGame[]> {
    return this.pongService.getAllGames();
  }
}
