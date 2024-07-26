import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';

import { blogProviders } from './blog.provider';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';


@Module({
  imports: [DatabaseModule],
  controllers: [BlogController],
  providers: [ BlogService, ...blogProviders],
})
export class BlogModule {}
