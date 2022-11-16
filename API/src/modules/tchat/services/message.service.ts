import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '../entities/message.entity';
import { IMessage } from '../interfaces/message.interface';
import { IChannel } from '../interfaces/channel.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(message: IMessage): Promise<IMessage> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findChannelMessages(channel: IChannel): Promise<IMessage[]> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.channel', 'channel')
      .where('channel.id = :id', { id: channel.id })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.createdAt', 'ASC');
    const haveMessage: IMessage[] = await query.getMany();

    const msg: IMessage[] = [];
    for (const message of haveMessage) {
      msg.push(message);
    }
    return msg;
  }
}
