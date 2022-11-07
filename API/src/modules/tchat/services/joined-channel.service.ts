import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Channel } from '../entities/channel.entity';

import { JoinedChannel } from '../entities/joined-channel.entity';
import { IJoinedChannel } from '../interfaces/channel.interface';
import { IChannel } from '../interfaces/channel.interface';

@Injectable()
export class JoinedChannelService {
    constructor (
        @InjectRepository(JoinedChannel)
        private readonly joinedChannelRepository: Repository<JoinedChannel>
    ) {}

    async create(joinedChannel: IJoinedChannel): Promise<IJoinedChannel> {
        return this.joinedChannelRepository.save(joinedChannel);
    }

    // async findByChannel(channel: IChannel): Promise<IJoinedChannel[]> {
    //     return this.joinedChannelRepository.find({ where: { channel: channel as FindOptionsWhere<JoinedChannel> }, relations: ['user']});
    // }

    async deleteBySocketId(socketId: string) {
        return this.joinedChannelRepository.delete({socketId});
    }

    async deleteAll() {
        await this.joinedChannelRepository
        .createQueryBuilder()
        .delete()
        .execute();
    }
}