import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CookieInterceptor } from './auth/cookie.interceptor';

// Interceptor is a concept in NestJs that is use to modify the response object
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
    }),

    AuthModule,
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CookieInterceptor 
    } 
  ]
})
export class AppModule {}
