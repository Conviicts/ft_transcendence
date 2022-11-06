import { User } from '../../users/entities/user.entity';
import { Entity, ManyToMany } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class DMChannel extends Channel {
  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  users: User[];
}
