import {
    Body,
    Controller,
    Post,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiConflictResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from '../users/guards/user.guard';


import { TextChannel } from './entities/text-channel.entity';
import { TextChannelDTO, GetTextChannelDTO } from './dto/text-channel.dto';
import { ChannelService } from './services/channel.service';

@ApiTags('channels')
@Controller('api/channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @UseGuards(AuthGuard('jwt'), UserGuard)
    @Post('/')
    createChannel(
        @Req() req,
        @Body() channel: TextChannelDTO,
    ): Promise<TextChannel> {
        return this.channelService.createChannel(channel, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'), UserGuard)
    @Post('/channel')
    getChannel(
        @Req() req,
        @Body() channel: GetTextChannelDTO,
    ): Promise<TextChannel> {
        return this.channelService.getChannel(channel);
    }
}
