import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    async findUser(id: string): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: { oauth_id: `intra-${id}` }
        });
    }

    async createUser(oauthId: string): Promise<UserEntity> {
        const user: any = {
          name: null,
          oauth_id: oauthId,
        };
        return await this.userRepository.save(user);
    }

    addUser(userId: string): Promise<UserEntity> {
        return this.createUser(`intra-${userId}`);
    }
}