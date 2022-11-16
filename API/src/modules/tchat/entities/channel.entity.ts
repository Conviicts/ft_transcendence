import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { JoinedChannel } from './joined-channel.entity';
import { UserRole } from '../../users/entities/user-role.entity';
import { Message } from './message.entity';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', { default: false })
  isDM: boolean;

  @Column('text', { default: '' })
  name: string;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable()
  users: User[];

  @Column('boolean', { default: false })
  isPublic: boolean;

  @Column('text', { default: '' })
  password: string;

  @OneToMany(() => JoinedChannel, (joinedChannel) => joinedChannel.channel, {
    cascade: true,
  })
  joinedUsers: JoinedChannel[];

  @OneToMany(() => UserRole, (roleUser) => roleUser.channel, { cascade: true })
  userRole: UserRole[];

  @Column('simple-array', { default: [] })
  admins: string[];

  @OneToMany(() => Message, (message) => message.channel, { cascade: true })
  messages: Message[];

  @Column('text', { default: '' })
  owner: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
