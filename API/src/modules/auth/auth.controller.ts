import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
  } from '@nestjs/common';
import { FortyTwoGuard } from '../../middlewares/guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
      private configService: ConfigService,
      private authService: AuthService,
    ) {}
  
    @Get('/login')
    @UseGuards(FortyTwoGuard)
    login(@Res() res): any {
      res.redirect(`http://localhost:${process.env.PORT}`);
    }

    @Post('/logout')
    async logout(@Req() req: Request): Promise<void> {
        if (!req.session) return;
        await new Promise<void>((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}