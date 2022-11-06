import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import jwt_decode from 'jwt-decode';

import { User } from '../entities/user.entity';
import { UserService } from '../user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const decode = jwt_decode(request.cookies.jwt);
    if (decode['auth'] === false && user.twoFactor === true) {
      throw new ForbiddenException('need 2FA');
    }
    return true;
  }
}
