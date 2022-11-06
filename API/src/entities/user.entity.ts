import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

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
