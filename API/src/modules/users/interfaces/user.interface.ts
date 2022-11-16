import { IChannel } from '../../tchat/interfaces/channel.interface';
import { User } from '../entities/user.entity';

export interface IUserRole {
  id?: string;
  uid: string;
  ban?: Date;
  mute?: Date;
  channel: IChannel;
}

export interface IUserConnected {
  uid?: string;
  socketId: string;
  user: User;
}
