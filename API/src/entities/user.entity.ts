import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: '', unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  oauth_id: string;

  @Column({ default: false })
  administrator: boolean;

  @Column({ default: null })
  avatar: string;

  @Column({ nullable: true, type: 'text' })
  tfa: string;

  isAdministrator() {
    return this.administrator;
  }

  have2FA() {
    return this.tfa !== null;
  }
}