import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { CookieInterceptor } from './auth/cookie.interceptor';
import { BlogModule } from './blog/blog.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

// Interceptor is a concept in NestJs that is use to modify the response object
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
    }),

    AuthModule,
    BlogModule,
    MarketplaceModule
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CookieInterceptor 
    } 
  ]
})
export class AppModule {}
