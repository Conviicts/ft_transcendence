import { IsAlphanumeric, IsEmail } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';

import { UserState } from '../interfaces/user-state.interface';
import { JoinedChannel } from '../../tchat/entities/joined-channel.entity';
import { Message } from '../../tchat/entities/message.entity';
import { ConnectedUser } from '../../tchat/entities/connected-user.entity';
import { PongGame } from 'src/modules/pong/entities/pong.entity';
import { Avatar } from './avatar.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @IsAlphanumeric()
  @Column({ unique: true })
  username: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Avatar, (avatar) => avatar.user)
  profile_picture: Avatar;

  @Column('text', { default: '' })
  login42: string;

  @Column('boolean', { default: false })
  twoFactor: boolean;

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @Column('text', { default: UserState.OFFLINE })
  status: UserState;

  @OneToMany(() => ConnectedUser, (connection) => connection.user)
  connections: ConnectedUser[];

  @OneToMany(() => JoinedChannel, (joinedChannel) => joinedChannel.channel)
  joinedChannels: JoinedChannel[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @Column('int', { default: 0 })
  wins: number;

  @Column('int', { default: 0 })
  looses: number;

  @Column('int', { default: 0 })
  games_count: number;

  @ManyToMany(() => PongGame, (pong) => pong.users, { eager: true })
  @JoinTable()
  games: PongGame[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
