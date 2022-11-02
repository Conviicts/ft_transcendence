import { IsAlphanumeric, IsEmail } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @IsAlphanumeric()
  @Column({unique: true})
  username: string;

  @IsEmail()
  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column("text", {default: ""})
  profile_picture: string;

  @Column("text", {default: ""})
  login42: string;
  
  @Column("boolean", {default: false})
  twoFactor: boolean;
  
  @Column("boolean", {default: false})
  isAdmin: boolean;

  @Column('date', { default: () => '((CURRENT_DATE))' })
  createdDate: Date;
}