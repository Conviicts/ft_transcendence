/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { FriendsRepository } from '../repositories/friends.repository';
import { UserService } from './user.service';

@Injectable()
export class FriendsService {
  constructor(
    private readonly userService: UserService,

    @InjectRepository(FriendsRepository)
    private friendsRepository: FriendsRepository,
  ) {}

  addFriend(friend: string, user: User): Promise<void> {
    return this.friendsRepository.addFriend(friend, user);
  }

  deleteFriend(friend: string, user: User): Promise<void> {
    return this.friendsRepository.deleteFriend(friend, user);
  }

  async getFriendsList(user: User): Promise<object> {
    let i = 0;
    const friends = [];
    while (user.friends[i]) {
      await this.userService.getUserInfos(user.friends[i]).then(function (res) {
        friends.push(res);
        i++;
      });
    }
    return friends;
  }

  updateRestrictedUsers(
    toggle: boolean,
    user: User,
    target: User,
  ): Promise<User> {
    return this.friendsRepository.updateRestrictedUsers(toggle, user, target);
  }
}
