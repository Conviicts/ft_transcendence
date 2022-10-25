import { Injectable, Inject } from '@nestjs/common';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserService)
        private userService: UserService,
    ) {}

    async validateSignin(userId: string): Promise<any> {
        let user = await this.userService.findUser(userId);

        if (!user)
            user = await this.userService.addUser(userId);
        return user;
    }
}