import { IsAlphanumeric, IsEmail } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserState } from '../interfaces/user-state';

@Entity()
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

  @Column('text', { default: '' })
  profile_picture: string;

  @Column('text', { default: '' })
  login42: string;

  @Column('boolean', { default: false })
  twoFactor: boolean;

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @Column('text', { default: UserState.OFFLINE })
  status: UserState;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
