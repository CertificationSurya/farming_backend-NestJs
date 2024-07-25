import { Module } from '@nestjs/common';

import { OTPModule } from './otp/otp.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userProviders } from './user.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [OTPModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, ...userProviders],
})
export class AuthModule {}
