import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity({ name: 'user_state' })
export class UserState {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column('text')
  socketId: string;

  //   @ManyToOne(() => User, (user) => user.connections, { onDelete: 'CASCADE' })
  //   @JoinColumn()
  //   user: User;
}
