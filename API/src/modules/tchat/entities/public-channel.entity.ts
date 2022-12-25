import { Column, Entity, JoinColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { BannedUser } from './banned.entity';
import { Channel } from './channel.entity';
import { MutedUser } from './muted.entity';

@Entity()
export class PublicChannel extends Channel {
  @Column({ unique: true, length: 8 })
  name: string;

  @Column({ default: true })
  public: boolean;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  owner: User;

  @Column('simple-array', { default: [] })
  admins: string[];

  @OneToMany(() => MutedUser, (mutedUser) => mutedUser.channel, { eager: true })
  muted: MutedUser[];

  @OneToMany(() => BannedUser, (bannedUser) => bannedUser.channel, {
    eager: true,
  })
  banned: BannedUser[];
}
