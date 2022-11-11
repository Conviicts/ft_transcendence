import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TchatModule } from '../tchat/tchat.module';
import { UserModule } from '../users/user.module';
import { PongRepository } from './pong.repository';
import { UserRepository } from '../users/user.repository';
import { PongGame } from './entities/pong.entity';
import { PongService } from './pong.service';
import { PongController } from './pong.controller';
import { User } from '../users/entities/user.entity';

import { provideCustomRepository } from '../users/custom-repository.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([PongGame]),
    TchatModule,
    UserModule
  ],
  providers: [
    provideCustomRepository(User, UserRepository),
    provideCustomRepository(PongGame, PongRepository),
    PongService
  ],
  controllers: [PongController],
  exports: [PongService],
})
export class PongModule {}