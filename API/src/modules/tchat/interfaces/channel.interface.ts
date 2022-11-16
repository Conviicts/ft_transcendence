import { User } from '../../users/entities/user.entity';

export interface IChannel {
  id: string;
  isDM: boolean;
  name: string;
  users: User[];
  isPublic: boolean;
  password: string;
  admins: string[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJoinedChannel {
  id?: string;
  socketId: string;
  user: User;
  channel: IChannel;
}
