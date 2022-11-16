import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from '../entities/user.entity';
import { NewUserDTO, UpdateUserDTO, User42DTO } from '../dto/user.dto';

export class UserRepository extends Repository<User> {
  async createUser(userData: NewUserDTO): Promise<User> {
    const user = this.create(userData);

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    user.friends = [];
    user.restricted = [];
    const firstUser = await this.createQueryBuilder('user')
      .getCount()
      .catch(() => 0);
    if (firstUser === 0) user.isAdmin = true;
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or email already exist');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
    return user;
  }

  async create42User(userData: User42DTO): Promise<User> {
    const user: User = this.create(userData);
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    user.friends = [];
    user.restricted = [];
    user.login42 = userData.login42;
    const firstUser = await this.createQueryBuilder('user')
      .getCount()
      .catch(() => 0);
    if (firstUser === 0) user.isAdmin = true;
    return this.save(user);
  }

  async updateUser(data: UpdateUserDTO, user: User): Promise<boolean> {
    if (data.username) user.username = data.username;
    if (data.email) user.email = data.email;
    if (data.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(data.password, salt);
    }
    try {
      await this.save(user);
      return true;
    } catch (e) {
      if (e.code == '23505')
        throw new InternalServerErrorException(
          'Username or email already taken',
        );
      throw new InternalServerErrorException();
    }
  }
}
