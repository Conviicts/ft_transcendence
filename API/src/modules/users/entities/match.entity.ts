import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { array: true, default: [] })
  score: number[];

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  winner: User;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  looser: User;

  @Column({ type: 'timestamptz' })
  date: Date;
}
