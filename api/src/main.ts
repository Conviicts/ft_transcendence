import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();

  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: config.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400,
        httpOnly: false,
        sameSite: 'strict',
        secure: false,
      },
    }),
  );

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  const swagger_config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('42 transcendence project')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swagger_config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
