/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class sessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: Function) {
    process.nextTick(() => done(null, user.id));
  }

  deserializeUser(id: number, done: Function) {
    const user = this.userService.findOne(id);
    if (!user) return done(new Error('User not found'), false);
    return done(null, user);
  }
}
