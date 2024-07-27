import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';

import { userProviders } from 'src/auth/user.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { conversationProvider } from '../common/providers/conversation.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders, ...conversationProvider],
})
export class UserModule {}
