import { Repository } from 'typeorm';
import {
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from '../entities/user.entity';

export class FriendsRepository extends Repository<User> {
  async addFriend(friend: string, user: User): Promise<void> {
    const found = user.friends.find((x) => x === friend);
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
    const userFound = user.restricted.find((x) => x === target.uid);
    if (toggle === true && !userFound) {
      user.restricted.push(target.uid);
      try {
        await this.save(user);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('add blocked user');
      }
    }
    if (toggle === false && userFound) {
      const index = user.restricted.indexOf(target.uid);
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
