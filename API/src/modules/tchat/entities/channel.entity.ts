import {
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  TableInheritance,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { MessageLogs } from './message-log.entity';

@Entity()
@TableInheritance()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => MessageLogs)
  @JoinTable()
  logs: MessageLogs[];
}
