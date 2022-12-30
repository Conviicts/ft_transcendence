import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { ConnectedUsersService } from './connected-users.service';

@Module({
  providers: [ConnectedUsersService, UserService],
  exports: [ConnectedUsersService],
  imports: [PrismaModule, JwtModule],
})
export class ConnectedUsersModule {}
