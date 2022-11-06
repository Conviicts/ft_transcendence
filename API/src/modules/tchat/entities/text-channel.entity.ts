import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Channel } from './channel.entity';

@Entity()
export class TextChannel extends Channel {
  @Column({ unique: true })
  name: string;

  @Column({ default: true })
  public: boolean;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  owner: User;

  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @ManyToMany(() => User)
  @JoinTable()
  muted: User[];

  @ManyToMany(() => User)
  @JoinTable()
  banned: User[];
}
