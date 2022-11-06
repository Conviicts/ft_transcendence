import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Log } from '../entities/log.entity';
import { UserService } from '../../users/user.service';
import { TextChannel } from '../entities/text-channel.entity';
import { User } from '../../users/entities/user.entity';
import { GetTextChannelDTO, TextChannelDTO } from '../dto/text-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectRepository(TextChannel)
    private readonly textChannelRepository: Repository<TextChannel>,

    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}
  
  async createChannel(
    channel: TextChannelDTO,
    userId: string,
  ): Promise<TextChannel> {
      const admin = await this.userService.getUser(userId);
      if (admin == undefined) {
        throw new HttpException(
          'channel admin needed',
          HttpStatus.FORBIDDEN,
        );
      }
      channel.name = channel.name.replace(/\s+/g, '');
      if (channel.name == undefined) {
        throw new HttpException(
          'channel name needs to be specified',
          HttpStatus.FORBIDDEN,
        );
      }
      let hashedPassword = null;
      if (channel.public == false) {
        if (!channel.password)
          throw new HttpException('Password Required', HttpStatus.FORBIDDEN);
        if (channel.password.length > 16)
          throw new HttpException(
            'New password too long',
            HttpStatus.FORBIDDEN,
          );
        try {
          hashedPassword = bcrypt.hashSync(channel.password, 10);
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }
      if (await this.textChannelRepository.findOne({ where: { name: channel.name }})) {
        throw new HttpException(
          'channel already exists',
          HttpStatus.FORBIDDEN,
        );
      }
      const currentChannel = this.textChannelRepository.create({
        name: channel.name,
        admins: [admin],
        public: channel.public,
        owner: admin,
        users: [admin],
        muted: [],
        banned: [],
        password: hashedPassword,
      });
  
      try {
        await this.textChannelRepository.save(currentChannel);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      delete currentChannel.password;
      return currentChannel;
  }

  async getChannel(
    chann: GetTextChannelDTO,
  ): Promise<TextChannel> {
    let channel = null;
    if (chann.id)
      channel = await this.textChannelRepository.findOne({ where: { id: chann.id } });
    if (!channel)
      throw new HttpException('channel not found', HttpStatus.NOT_FOUND);

    if (!chann.needPass) delete channel.password;
    return channel;
  }
}
