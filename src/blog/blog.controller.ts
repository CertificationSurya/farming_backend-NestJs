import {
  UseGuards,
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';

import { BlogService } from './blog.service';

import type { AllKeySameType } from '../common/definations';
import { Request } from 'express';
import { FetchUser } from 'src/guards/AuthGuard';
import { SuccessResponse } from 'src/common/filters/Response.dto';
import { Blog } from './dto/create-blog.dto';


@Controller('/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getAllPosts() {
    return await this.blogService.getAllPost();
  }

  @Post()
  @UseGuards(FetchUser)
  async createPost(
    @Body() { title, body }: AllKeySameType<string>,
    @Req() req: Request,
  ): Promise<SuccessResponse<Blog>>{
    // @ts-ignore
    const {userId, username}: AllKeySameType<string> = req.userData;
    const res = await this.blogService.createPost({ title, body }, { userId, username });
    return res
  }

  @Get('/:id')
  getSinglePost(@Param('id') id: string) {
    return this.blogService.getSinglePost(id);
  }

  @Patch('/:id')
  @UseGuards(FetchUser)
  updatePost(
    @Param('id') id: string,
    @Body() { title, body }: AllKeySameType<string>,
  ) {
    //@ts-ignore
    const { userId } = req.userData;
    return this.blogService.updatePost({ title, body }, { id, userId });
  }

  @Delete('/:id')
  @UseGuards(FetchUser)
  deletePost(@Param('id') id: string) {
    //@ts-ignore
    const { userId } = req.userData;
    return this.blogService.deletePost({ id, userId });
  }

  @Get('/user')
  getUserPosts() {
    //@ts-ignore
    const { userId }: { userId: string } = req.userData;
    return this.blogService.getUserPosts(userId);
  }

  @Get('/user-related/:userId')
  getUserRelatedPosts(@Param('userId') userId: string) {
    this.blogService.getUserRelatedPosts(userId);
  }
}
