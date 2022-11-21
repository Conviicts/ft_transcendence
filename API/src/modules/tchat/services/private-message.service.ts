import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PrivateMessage } from '../entities/private-message.entity';
import { MessageLogs } from '../entities/message-log.entity';
import { UserService } from '../../users/services/user.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class PrivateMessageService {
  constructor(
    private readonly userService: UserService,

    @InjectRepository(PrivateMessage)
    private readonly privateChannelRepository: Repository<PrivateMessage>,

    @InjectRepository(MessageLogs)
    private readonly messageLogsRepository: Repository<MessageLogs>,
  ) {}

  async getChannel(
    channelId: number,
    needPass?: boolean,
  ): Promise<PrivateMessage> {
    let channel = null;
    if (channelId)
      channel = await this.privateChannelRepository.findOne({
        where: { id: channelId },
      });
    if (!channel)
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

    if (!needPass) delete channel.password;
    return channel;
  }

  async getChannels(uid: string): Promise<PrivateMessage[]> {
    const uncompleted: PrivateMessage[] = await this.privateChannelRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.users', 'user')
      .where('user.uid = :uid', { uid })
      .getMany();

    const unresolved: Promise<PrivateMessage>[] = uncompleted.map((channel) =>
      this.getChannel(channel.id),
    );
    return await Promise.all(unresolved);
  }

  async createChannel(users: User[]): Promise<PrivateMessage> {
    if (users.length > 2)
      throw new HttpException(
        'Too many users in channel',
        HttpStatus.NOT_ACCEPTABLE,
      );
    const channel = this.privateChannelRepository.create({ users });

    try {
      await this.privateChannelRepository.save(channel);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return channel;
  }

  async deleteChannel(channelId: number): Promise<void> {
    const channel = await this.getChannel(channelId);
    try {
      await this.messageLogsRepository.remove(channel.logs);
      await this.privateChannelRepository.delete(channel.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addMessage(
    channelId: number,
    uid: string,
    text: string,
  ): Promise<MessageLogs> {
    const channel = await this.getChannel(channelId);
    const user = await this.userService.getUser(uid);
    const other = channel.users.find((user1) => user1.uid != user.uid);

    if (!other) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (other.restricted.includes(user.uid))
      throw new HttpException('User is blocked', HttpStatus.CONFLICT);
    if (!channel.users.some((user) => user.uid == uid))
      throw new HttpException('User not in channel', HttpStatus.NOT_FOUND);

    const log = this.messageLogsRepository.create({ message: text, user });

    try {
      await this.messageLogsRepository.save(log);
      await this.privateChannelRepository
        .createQueryBuilder()
        .relation(PrivateMessage, 'logs')
        .of(channel)
        .add(log);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return log;
  }

  async joinChannel(uid: string, targetId: string): Promise<PrivateMessage> {
    if (uid == targetId)
      throw new HttpException('User cannot be the same', HttpStatus.FORBIDDEN);
    const user = await this.userService.getUser(uid);
    const target = await this.userService.getUser(targetId);
    return await this.createChannel([user, target]);
  }
}
