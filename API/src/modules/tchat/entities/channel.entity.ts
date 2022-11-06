import {
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  TableInheritance,
} from 'typeorm';

import { Log } from './log.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToMany(() => Log)
  @JoinTable()
  logs: Log[];
}
