import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Channel } from './channel.entity';

@Entity({ name: 'joined_channels' })
export class JoinedChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  socketId: string;

  @ManyToOne(() => User, (user) => user.joinedChannels, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.joinedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  channel: Channel;
}
