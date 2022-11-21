import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';

import { PublicChannel } from '../entities/public-channel.entity';
import { IPassword } from '../interfaces/password.interface';
import { PublicChannelService } from '../services/public-channel.service';

@Controller('tchat')
export class TchatController {
  constructor(private readonly publicChannelService: PublicChannelService) {}

  @Get('/')
  getAllChannels(): Promise<PublicChannel[]> {
    return this.publicChannelService.getAllChannels();
  }

  @Post('/')
  createChannel(
    @Req() req,
    @Body() channel: PublicChannel,
  ): Promise<PublicChannel> {
    return this.publicChannelService.createChannel(channel, req.user.userId);
  }

  @Post(':id')
  updatePassword(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() pass: IPassword,
  ): Promise<void> {
    return this.publicChannelService.changePassword(pass, id, req.user.userId);
  }
}
