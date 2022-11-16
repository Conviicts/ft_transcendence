import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/repositories/user.repository';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async getUsers(): Promise<Partial<User[]>> {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.uid', 'user.username', 'user.status', 'user.isAdmin'])
      .leftJoinAndSelect('user.avatar', 'avatar')
      .getMany();
    return data;
  }

  async getAdmin(): Promise<Partial<User[]>> {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .andWhere('user.isAdmin = :isAdmin', { isAdmin: true })
      .select(['user.uid', 'user.username', 'user.status', 'user.isAdmin'])
      .leftJoinAndSelect('user.avatar', 'avatar')
      .getMany();
    return data;
  }
}
