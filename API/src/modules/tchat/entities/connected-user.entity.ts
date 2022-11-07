import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
export class ConnectedUser {
  @PrimaryGeneratedColumn('uuid')
  connectedUserId: string;

  @Column('text')
  socketId: string;

  @ManyToOne(() => User, (user) => user.connections, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
