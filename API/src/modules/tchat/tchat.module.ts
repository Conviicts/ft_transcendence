import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../users/user.module';
import { UserRepository } from '../users/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    TypeOrmModule.forFeature([UserRepository]),
    UserModule,
  ],
  providers: [],
  exports: [],
})
export class TchatModule {}
