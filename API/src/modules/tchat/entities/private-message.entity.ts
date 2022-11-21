import { Entity, ManyToMany } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Channel } from './channel.entity';

@Entity()
export class PrivateMessage extends Channel {
  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  users: User[];
}
