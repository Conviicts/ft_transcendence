import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiTags } from '@nestjs/swagger';
import { ChatRoom } from '@prisma/client';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { ValidationPipe } from 'src/user/validation.pipe';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('room')
  @UseGuards(JwtAuthGuard)
  async getRooms(@Request() req) {
    return await this.chatService.getRoomsFromUser(req.user.id);
  }

  @Post('room/join/:id')
  @UseGuards(JwtAuthGuard)
  async joinRoom(@Request() req, @Param('id') id: number): Promise<ChatRoom> {
    return await this.chatService.addUsersToRoom(id, req.user.id);
  }

  @Post('room/leave/:id')
  @UseGuards(JwtAuthGuard)
  async leaveRoom(@Request() req, @Param('id') id: number): Promise<ChatRoom> {
    return await this.chatService.removeUsersFromRoom(id, req.user.id);
  }

  @Get('rooms/public')
  async getPublicRooms(): Promise<ChatRoom[]> {
    return await this.chatService.getPublicRooms();
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createRoom(
    @Request() req,
    @Body(new ValidationPipe()) createChatDto: CreateChatDto,
  ) {
    const room = await this.chatService.createRoom(req.user, createChatDto);
    if (room) this.eventEmitter.emit('room.new', { room: room });
  }
}
