import {
    ExecutionContext,
    HttpException,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
  
@Injectable()
export class FortyTwoGuard extends AuthGuard('intra-oauth') {
    constructor(private readonly configService: ConfigService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }

    handleRequest(err: any, user: any) {
        console.log(err)
        console.log(user)
        if (err || !user)
            throw new HttpException('failed to login', err.status);
        return user;
    }
}
