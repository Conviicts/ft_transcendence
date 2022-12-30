import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisa: PrismaService) {}

  async newMessage(message: Message): Promise<Message> {
    return this.prisa.message.create({ data: message });
  }

  async getMessagesFromRoom(roomId: number): Promise<Message[]> {
    return this.prisa.message.findMany({
      where: {
        roomId: roomId,
      },
    });
  }
}
