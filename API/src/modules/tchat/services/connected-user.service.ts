import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { ConnectedUser } from '../entities/connected-user.entity';
import { IUserConnected } from '../../users/interfaces/user.interface';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUser)
    private readonly connectedUserRepository: Repository<ConnectedUser>,
  ) {}

  async create(connectedUser: IUserConnected): Promise<IUserConnected> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findAll(): Promise<IUserConnected[]> {
    const connections = await this.connectedUserRepository.find({
      relations: ['user'],
    });
    return connections;
  }

  async findUser(user: User): Promise<IUserConnected> {
    return this.connectedUserRepository.findOne({
      where: { user: user as FindOptionsWhere<User> },
    });
  }

  async deleteUser(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }
  async deleteAll() {
    await this.connectedUserRepository.createQueryBuilder().delete().execute();
  }

  async userStatus() {
    const query = await this.connectedUserRepository.find({
      relations: ['user'],
    });
    const userConnected = [];
    for (const field of query) {
      userConnected.push(field.user.userId);
    }
    return userConnected;
  }
}
