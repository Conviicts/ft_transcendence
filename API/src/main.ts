import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

import * as passport from 'passport';
import * as session from 'express-session';

async function bootstrap() {
  // Check if CORS env exists
  if (!process.env.CORS) process.env.CORS = '';

  const app = await NestFactory.create(AppModule, { 
    cors: {
      credentials: true,
      origin: process.env.CORS.split(' ').filter((value) => value.length > 0)
    }
  });

  app.use(
    session({
      cookie: {
        maxAge: 604800000, 
        httpOnly: false,
        secure: false,
      },
      secret: 'secret',
      name: 'auth',
      resave: false,
      rolling: true,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Set base link to /api/v1
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
