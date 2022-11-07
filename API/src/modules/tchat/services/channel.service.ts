import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../../users/strategy/jwt.strategy';
import { parse } from 'cookie';

import { User } from '../../users/entities/user.entity';
import { IChannel } from '../interfaces/channel.interface';
import { UserRepository } from '../../users/user.repository';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async createChannel(channel: IChannel, creator: User): Promise<IChannel> {
    const { name, isPublic } = channel;
    let { password } = channel;
    const chanName = await this.channelRepository.findOne({ where: { name } });
    if (chanName) return null;
    if (/^([a-zA-Z0-9-]+)$/.test(name) === false) return null;
    channel.admins = [];
    channel.owner = creator.userId;
    if (!password) password = null;
    if (isPublic === false) {
      channel.users.push(creator);
      if (password) {
        if (/^([a-zA-Z0-9]+)$/.test(password) === false) return null;
        const salt = await bcrypt.genSalt();
        channel.password = await bcrypt.hash(password, salt);
        channel.users.push(creator);
      } else {
        for (const user of channel.users) {
          channel.users.push(user);
        }
      }
    }
    return this.channelRepository.save(channel);
  }

  async deleteChannel(channel: IChannel) {
    const channelFound: Channel = await this.channelRepository.findOne({
      where: { channelId: channel.channelId },
    });
    if (channelFound) {
      try {
        channelFound.users = [];
        try {
          await this.channelRepository.save(channelFound);
        } catch (error) {
          console.log(error);
          throw new InternalServerErrorException('empty user on channel');
        }
        await this.channelRepository.delete(channelFound.channelId);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('delete channel');
      }
    }
  }

  async getChannel(channelId: string): Promise<IChannel> {
    return this.channelRepository.findOne({ where: { channelId } });
  }

  async getUserChannels(userId: string): Promise<IChannel[]> {
    let query = this.channelRepository
      .createQueryBuilder('channels')
      .where('channels.isPublic = true');
    const publicChannels: IChannel[] = await query.getMany();

    query = this.channelRepository
      .createQueryBuilder('channels')
      .leftJoin('channels.users', 'users')
      .where('users.userId = :userId', { userId })
      .andWhere('channels.isPublic = false')
      .leftJoinAndSelect('channels.users', 'all_users')
      .leftJoinAndSelect('channels.userRole', 'all_roles')
      .orderBy('channels.createdAt', 'DESC');
    const privateChannels: IChannel[] = await query.getMany();

    const channels = publicChannels.concat(privateChannels);

    channels.sort(function (date1, date2) {
      const d1 = new Date(date1.createdAt);
      const d2 = new Date(date2.createdAt);
      if (d1 < d2) return 1;
      else if (d1 > d2) return -1;
      else return 0;
    });
    return channels;
  }

  async getUser(client: Socket): Promise<User> {
    const cookie = client.handshake.headers['cookie'];
    const { jwt } = parse(cookie);
    const payload: JwtPayload = this.jwtService.verify(jwt, {
      secret: process.env.SECRET,
    });
    const { username } = payload;
    const user: User = await this.userRepository.findOne({
      where: { username },
    });
    return user;
  }

  //   async updateAdmins(admin: boolean, channel: IChannel, user: User) {}
}
