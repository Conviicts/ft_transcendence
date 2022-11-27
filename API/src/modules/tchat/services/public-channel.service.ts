import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { MessageLogs } from '../entities/message-log.entity';
import { UserService } from '../../users/services/user.service';
import { PublicChannel } from '../entities/public-channel.entity';
import { IPassword } from '../interfaces/password.interface';
import { MutedUser } from '../entities/muted.entity';
import { BannedUser } from '../entities/banned.entity';

@Injectable()
export class PublicChannelService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectRepository(PublicChannel)
    private readonly publicChannelRepository: Repository<PublicChannel>,

    @InjectRepository(MutedUser)
    private readonly mutedUserRepository: Repository<MutedUser>,

    @InjectRepository(BannedUser)
    private readonly bannedUserRepository: Repository<BannedUser>,

    @InjectRepository(MessageLogs)
    private readonly logRepository: Repository<MessageLogs>,
  ) {}

  async getChannel(
    channelId: number,
    needPass?: boolean,
  ): Promise<PublicChannel> {
    let channel = null;
    if (channelId)
      channel = await this.publicChannelRepository.findOne({
        where: { id: channelId },
      });
    if (!channel)
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

    if (!needPass) delete channel.password;
    return channel;
  }

  async createChannel(
    channel: PublicChannel,
    userId: string,
  ): Promise<PublicChannel> {
    const admin = await this.userService.getUser(userId);

    channel.name = channel.name.replace(/\s+/g, '');

    if (channel.name == undefined)
      throw new HttpException(
        'Channel name needs to be specified',
        HttpStatus.FORBIDDEN,
      );

    let hashedPassword = null;
    if (channel.public == false) {
      if (!channel.password)
        throw new HttpException('Password Required', HttpStatus.FORBIDDEN);

      if (channel.password.length > 16)
        throw new HttpException('New password too long', HttpStatus.FORBIDDEN);

      try {
        hashedPassword = bcrypt.hashSync(channel.password, 10);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
    if (
      await this.publicChannelRepository.findOne({
        where: { name: channel.name },
      })
    )
      throw new HttpException('Channel already exists', HttpStatus.FORBIDDEN);
    const currentChannel = this.publicChannelRepository.create({
      name: channel.name,
      admins: [admin.uid],
      public: channel.public,
      owner: admin,
      users: [admin],
      muted: [],
      password: hashedPassword,
    });

    try {
      await this.publicChannelRepository.save(currentChannel);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    delete currentChannel.password;
    return currentChannel;
  }

  async deleteChannel(id: number): Promise<void> {
    const channel = await this.getChannel(id);

    await this.logRepository.remove(channel.logs);
    await this.publicChannelRepository.remove(channel);
  }

  async removeUserFromChannel(
    userId: string,
    channelId: number,
    adminId?: string,
  ): Promise<void> {
    const user = await this.userService.getUser(userId);
    const channel = await this.getChannel(channelId);

    if (adminId && adminId != user.uid) {
      if (channel.admins.indexOf(adminId) == -1)
        throw new HttpException(
          'User is not admin in this channel',
          HttpStatus.FORBIDDEN,
        );

      if (user.uid == channel.owner.uid)
        throw new HttpException("Can't kick an owner", HttpStatus.FORBIDDEN);

      const index = channel.admins.indexOf(user.uid);
      if (index != -1) channel.admins.splice(index, 1);
    } else if (user.uid == channel.owner.uid)
      return await this.deleteChannel(channel.id);

    {
      const index = channel.users.findIndex((user1) => user1.uid == user.uid);
      if (index == -1)
        throw new HttpException('User not in channel', HttpStatus.NOT_FOUND);
      channel.users.splice(index, 1);
    }

    try {
      await this.publicChannelRepository.save(channel);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(
    pass: IPassword,
    channelId: number,
    userId: string,
  ): Promise<void> {
    if (pass.new.length > 16)
      throw new HttpException('New password too long', HttpStatus.FORBIDDEN);
    const user = await this.userService.getUser(userId);
    const channel = await this.getChannel(channelId);

    if (channel.public == true)
      throw new HttpException('Channel is public', HttpStatus.FORBIDDEN);
    if (channel.owner.uid != user.uid)
      throw new HttpException(
        "User isn't the channel's owner",
        HttpStatus.FORBIDDEN,
      );
    if (!pass.new)
      throw new HttpException(
        'New password cannot be empty',
        HttpStatus.FORBIDDEN,
      );

    if (!(await this.checkPassword(channel.id, pass.old)))
      throw new HttpException('Wrong password provided', HttpStatus.FORBIDDEN);

    try {
      const password = await bcrypt.hash(pass.new, 10);
      await this.publicChannelRepository.update(channel.id, { password });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async checkPassword(id: number, password: string): Promise<boolean> {
    if (!password) return false;

    const currentChannel = await this.getChannel(id, true);
    if (!currentChannel) return false;

    return await bcrypt.compare(password, currentChannel.password);
  }

  async getAllChannels(): Promise<PublicChannel[]> {
    const channels = await this.publicChannelRepository.find();
    channels.forEach((chat) => delete chat.password);
    return channels;
  }

  async getUserChannels(uid: string): Promise<PublicChannel[]> {
    const uncompleted: PublicChannel[] = await this.publicChannelRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.users', 'user')
      .where('user.uid = :uid', { uid })
      .getMany();

    const unresolved: Promise<PublicChannel>[] = uncompleted.map((channel) =>
      this.getChannel(channel.id),
    );
    return await Promise.all(unresolved);
  }

  async addUserToChannel(
    channel: PublicChannel,
    userId: string,
  ): Promise<void> {
    const user = await this.userService.getUser(userId);
    const curchannel = await this.getChannel(channel.id, true);
    if (!curchannel.public) {
      let valide = false;
      if (curchannel.password)
        valide = bcrypt.compareSync(channel.password, curchannel.password);
      if (!valide)
        throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    for (const banned of curchannel.banned) {
      if (banned.user.uid == user.uid) {
        const time = new Date();
        if (banned.endOfBan > time)
          throw new HttpException(
            'User is banned from Channel',
            HttpStatus.FORBIDDEN,
          );
        await this.debanUser(banned, curchannel);
      }
    }

    if (curchannel.users.find((user1) => user1.uid == user.uid))
      throw new HttpException('User already in channel', HttpStatus.CONFLICT);

    await this.publicChannelRepository
      .createQueryBuilder()
      .relation(PublicChannel, 'users')
      .of(curchannel)
      .add(user);
  }

  async toogleAdmin(
    ownerId: string,
    userId: string,
    channelid: number,
  ): Promise<void> {
    const owner = await this.userService.getUser(ownerId);
    const user = await this.userService.getUser(userId);
    const channel = await this.getChannel(channelid);
    if (channel.owner.uid != owner.uid)
      throw new HttpException(
        "User isn't the channel's owner",
        HttpStatus.FORBIDDEN,
      );

    if (user.uid == channel.owner.uid)
      throw new HttpException('Owner cannot be demoted', HttpStatus.FORBIDDEN);

    if (!channel.users.find((user1) => user1.uid == user.uid))
      throw new HttpException(
        'User is not in the channel',
        HttpStatus.FORBIDDEN,
      );

    const index = channel.admins.indexOf(user.uid);
    if (index == -1) channel.admins.push(user.uid);
    else channel.admins.splice(index, 1);

    try {
      await this.publicChannelRepository.save(channel);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async debanUser(user: BannedUser, channel: PublicChannel): Promise<void> {
    const index = channel.banned.findIndex((user1) => user1.id == user.id);
    if (index == -1) return;

    await this.bannedUserRepository.delete(user.id);
  }

  async demuteUser(user: MutedUser, channel: PublicChannel): Promise<void> {
    const index = channel.muted.findIndex((user1) => user1.id == user.id);
    if (index == -1) return;

    await this.mutedUserRepository.delete(user.id);
  }

  async muteUser(
    userId: string,
    channelid: number,
    adminId: string,
  ): Promise<void> {
    const user = await this.userService.getUser(userId);
    const admin = await this.userService.getUser(adminId);
    const currentChannel = await this.getChannel(channelid);
    if (currentChannel.owner.uid == user.uid)
      throw new HttpException('Owner cannot be muted', HttpStatus.FORBIDDEN);

    if (!currentChannel.users.find((user1) => user1.uid == user.uid))
      throw new HttpException('User is not in channel', HttpStatus.NOT_FOUND);

    if (!currentChannel.admins.find((adminId) => adminId == admin.uid))
      throw new HttpException(
        'User is not admin in channel',
        HttpStatus.FORBIDDEN,
      );

    if (currentChannel.muted.find((user1) => user1.id == user.uid))
      throw new HttpException('User is already muted', HttpStatus.FORBIDDEN);

    const time = new Date(Date.now() + 1800000);
    const muted = this.mutedUserRepository.create({
      user,
      endOfMute: time,
      channel: currentChannel,
    });

    try {
      await this.mutedUserRepository.save(muted);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async banUser(
    userId: string,
    channelid: number,
    adminId: string,
  ): Promise<void> {
    const admin = await this.userService.getUser(adminId);
    const user = await this.userService.getUser(userId);
    const currentChannel = await this.getChannel(channelid);
    if (currentChannel.owner.uid == user.uid)
      throw new HttpException(
        'User is owner and thus cannot be banned',
        HttpStatus.FORBIDDEN,
      );

    if (!currentChannel.users.find((user1) => user1.uid == user.uid))
      throw new HttpException('User is not in channel', HttpStatus.NOT_FOUND);

    if (!currentChannel.admins.find((adminId) => adminId == admin.uid))
      throw new HttpException(
        'User is not admin of this channel',
        HttpStatus.FORBIDDEN,
      );

    if (currentChannel.banned.find((user1) => user1.id == user.uid))
      throw new HttpException('User is already banned', HttpStatus.FORBIDDEN);

    const time = new Date(Date.now() + 1800000);
    const banned = this.bannedUserRepository.create({
      user,
      endOfBan: time,
      channel: currentChannel,
    });

    currentChannel.users.splice(
      currentChannel.users.findIndex((user1) => user1.uid == user.uid),
      1,
    );

    try {
      await this.publicChannelRepository.save(currentChannel);
      await this.bannedUserRepository.save(banned);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addLog(id: number, message: string, userId: string): Promise<void> {
    const user = await this.userService.getUser(userId);
    const currentChannel = await this.getChannel(id);
    if (!currentChannel.users.find((user1) => user1.uid == user.uid))
      throw new HttpException('User is not in channel', HttpStatus.NOT_FOUND);

    {
      const muted = currentChannel.muted.find((user1) => user1.id == user.uid);
      if (muted) {
        const time = new Date();
        if (muted.endOfMute > time)
          throw new HttpException(
            'User is muted from PublicChannel',
            HttpStatus.FORBIDDEN,
          );
        await this.demuteUser(muted, currentChannel);
      }
    }

    const log = this.logRepository.create({
      message: message,
      user: user,
    });

    try {
      await this.logRepository.save(log);
      await this.publicChannelRepository
        .createQueryBuilder()
        .relation(PublicChannel, 'logs')
        .of(currentChannel)
        .add(log);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
