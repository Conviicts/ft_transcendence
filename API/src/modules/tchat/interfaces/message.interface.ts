import { User } from '../../users/entities/user.entity';
import { IChannel } from './channel.interface';

export interface IMessage {
  id: string;
  content: string;
  user: User;
  channel: IChannel;
  createdAt: Date;
  updatedAt: Date;
}
