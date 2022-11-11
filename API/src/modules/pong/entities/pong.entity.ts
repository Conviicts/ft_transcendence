import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity({ name: 'games' })
export class PongGame {
  @PrimaryGeneratedColumn('uuid')
  gameId: string;

  @Column('simple-array')
  score: string[];

  @Column('text', { default: '' })
  playerOne: string;

  @Column('text', { default: '' })
  playerTwo: string;

  @Column('int', { default: 0 })
  duration: number;

  @Column('text', { default: '' })
  winner: string;

  @Column('text', { default: '' })
  looser: string;

  @ManyToMany(() => User, (user) => user.games, { onDelete: 'CASCADE' })
  users: User[];

  @Column('text', { default: '' })
  createdAt: string;
}
