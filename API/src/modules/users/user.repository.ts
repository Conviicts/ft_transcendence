import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';
import {
  ConflictException,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { NewUserDTO, UpdateUserDTO, User42DTO } from './dto/user.dto';

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

  async addFriend(friend: string, user: User): Promise<void> {
    const found = user.friends.find((element) => element === friend);
    if (found != undefined) {
      throw new UnauthorizedException({
        status: HttpStatus.FORBIDDEN,
        error: 'this user is already your friend',
      });
    }
    user.friends.push(friend);
    try {
      await this.save(user);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async deleteFriend(friend: string, user: User): Promise<void> {
    const index = user.friends.indexOf(friend);
    if (index !== -1) {
      user.friends.splice(index, 1);
    } else {
      throw new UnauthorizedException({
        status: HttpStatus.FORBIDDEN,
        error: 'this user is not your friend',
      });
    }
    try {
      await this.save(user);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async updateRestrictedUsers(
    toggle: boolean,
    user: User,
    target: User,
  ): Promise<User> {
    const userFound = user.restricted.find(
      (element) => element === target.userId,
    );
    if (toggle === true && !userFound) {
      user.restricted.push(target.userId);
      try {
        await this.save(user);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('add blocked user');
      }
    }
    if (toggle === false && userFound) {
      const index = user.restricted.indexOf(target.userId);
      user.restricted.splice(index, 1);
      try {
        await this.save(user);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('add blocked user');
      }
    }
    return user;
  }
}
