import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/user.repository';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async getUsers(): Promise<Partial<User[]>> {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.userId', 'user.username', 'user.status', 'user.isAdmin'])
      .leftJoinAndSelect('user.profile_picture', 'avatar')
      .getMany();
    return data;
  }

  async getAdmin(): Promise<Partial<User[]>> {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .andWhere('user.isAdmin = :isAdmin', { isAdmin: true })
      .select(['user.userId', 'user.username', 'user.status', 'user.isAdmin'])
      .leftJoinAndSelect('user.profile_picture', 'avatar')
      .getMany();
    return data;
  }
}
