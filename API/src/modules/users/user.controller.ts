import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Get(':id/')
    async findUser(@Param('id') usr: any): Promise<any> {
        const user = await this.userService.findUser(usr.id);
        return { user };
    }
}