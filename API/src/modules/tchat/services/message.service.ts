import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IChannel } from '../interfaces/channel.interface'
import { IMessage } from "../interfaces/message.interface";
import { Message } from "../entities/message.entity";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>
    ) {}

    async create(message: Message): Promise<Message> {
        return this.messageRepository.save(
            this.messageRepository.create(message)
        );
    }

    async findChannelMessages(channel: IChannel, user: User): Promise<IMessage[]> {
        const query = this.messageRepository
        .createQueryBuilder('message')
        .leftJoin('message.channel', 'channel')
        .where('channel.channelId = :channelId', {channelId: channel.channelId})
        .leftJoinAndSelect('message.user', 'user')
        .orderBy('message.createdAt', 'ASC');
        const haveMessage = await query.getMany();

        let result = [];
        for (const message of haveMessage) {
            result.push(message);
        }
		return result;
    }

}
