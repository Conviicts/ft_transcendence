import { Global, Module } from '@nestjs/common';

import { UserModule } from '../users/user.module';
import { NotifyGateway } from './notify.gateway';
import { NotifyService } from './notify.service';

@Global()
@Module({
  imports: [UserModule],
  providers: [NotifyGateway, NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
