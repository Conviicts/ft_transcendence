import { IsAlphanumeric, IsEmail } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { UserState } from '../interfaces/user-state.interface';
import { Avatar } from './avatar.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @IsAlphanumeric()
  @Column({ unique: true })
  username: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Avatar, (avatar) => avatar.user)
  avatar: Avatar;

  @Column('text', { default: '' })
  login42: string;

  @Column('boolean', { default: false })
  have2FA: boolean;

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @Column('text', { default: UserState.OFFLINE })
  status: UserState;

  @Column('simple-array')
  friends: string[];

  @Column('simple-array')
  restricted: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
