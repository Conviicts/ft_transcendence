import { Injectable } from '@nestjs/common';

import { User42DTO } from '../../users/dto/user.dto';
import { UserService } from '../../users/services/user.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(userData: User42DTO): Promise<User> {
    return this.userService.validate42User(userData);
  }

  createUser(userData: User42DTO): Promise<User> {
    return this.userService.create42User(userData);
  }
}
