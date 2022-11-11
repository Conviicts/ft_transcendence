import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '../entities/message.entity';
import { IMessage } from '../interfaces/message.interface';
import { User } from '../../users/entities/user.entity';
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

  async findChannelMessages(channel: IChannel, user: User): Promise<IMessage[]> {
    const query = this.messageRepository
    .createQueryBuilder('message')
    .leftJoin('message.channel', 'channel')
    .where('channel.channelId = :channelId', {channelId: channel.channelId})
    .leftJoinAndSelect('message.user', 'user')
    .orderBy('message.createdAt', 'ASC');
    const haveMessage: IMessage[] = await query.getMany();

    let msg: IMessage[] = [];
    for (const message of haveMessage) {
        msg.push(message);
    }
    return msg;
  }
}
