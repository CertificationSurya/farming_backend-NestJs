import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser'
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000', 'https://hack-farming.netlify.app'], // Allow your frontend's origin
      methods: 'GET,PATCH,POST,DELETE', // Allowed HTTP methods
      allowedHeaders: 'Content-Type, Authorization', // Allowed headers
      credentials: true
    },
  });

  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to true if using HTTPS
    }),
  );

  const port = process.env.PORT || 8000;
  await app.listen(port, () => {
    console.log(`Running the server in the port: ${port}`);
  });
}
bootstrap();
