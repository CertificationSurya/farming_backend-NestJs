import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { dbModels } from 'src/constants';

// normies
import {
  ServerErrorResponse,
  SuccessResponse,
} from 'src/common/filters/Response.dto';
import { AllKeySameType } from '../common/definations';
import { Blog } from './dto/create-blog.dto';

Injectable();
export class BlogService {
  constructor(@Inject(dbModels.Blog) private blogModel: Model<Blog>) {}

  async getAllPost(): Promise<SuccessResponse<Blog[]> | ServerErrorResponse> {
    try {
      const data = await this.blogModel.find().sort({ updatedAt: -1 }).exec();
      return new SuccessResponse<Blog[]>({
        data,
        message: 'Successfully retrieved blogs',
      });
    } catch (error) {
      throw new ServerErrorResponse();
    }
  }

  async getUserPosts(userId: string) {
    try {
      const data = await this.blogModel
        .find({ userId })
        .sort({ updatedAt: -1 });

      if (data)
        return new SuccessResponse<Blog[]>({
          data,
        });
    } catch (error) {
      console.log(error);
      throw new ServerErrorResponse();
    }
  }

  async getUserRelatedPosts(userId: string) {
    try {
      const data = await this.blogModel
        .find({ userId })
        .sort({ updatedAt: -1 });

      if (data)
        return new SuccessResponse<Blog[]>({
          data,
        });
    } catch (error) {
      console.log(error);
      throw new ServerErrorResponse();
    }
  }

  async createPost(
    { title, body }: AllKeySameType<string>,
    { userId, username }: AllKeySameType<string>,
  ) {
    try {
      const newPost = new this.blogModel({
        title,
        body,
        createdBy: username,
        userId,
      });

      await newPost.save();

      return new SuccessResponse<null>({
        message: 'Your post has been created',
      });
    } catch (err) {
      throw new ServerErrorResponse();
    }
  }

  async getSingleUser({id, userId}: AllKeySameType<string>) {
    try {
      const post = await this.blogModel.findOne({_id: id, userId});
      if (!post) throw new NotFoundException('Blog Not Found!');

      return new SuccessResponse<Blog>({
        data: post,
        message: 'Blog found successfully!',
      });
    } catch (err) {
      console.log(err);
      throw new ServerErrorResponse();
    }
  }
  
  async getSinglePost(id: string) {
    try {
      const post = await this.blogModel.findById(id);
      if (!post) throw new NotFoundException('Blog Not Found!');

      return new SuccessResponse<Blog>({
        data: post,
        message: 'Blog found successfully!',
      });
    } catch (err) {
      console.log(err);
      throw new ServerErrorResponse();
    }
  }

  async updatePost(
    { title, body }: AllKeySameType<string>,
    { id, userId }: AllKeySameType<string>,
  ) {
    try {
      const post = await this.blogModel.findOneAndUpdate(
        { _id: id, userId },
        { title, body },
        { new: true },
      );
      if (!post) throw new NotFoundException('Post not found');

      return new SuccessResponse<Blog>({
        data: post,
        message: 'Updated Blog Successfully!',
      });
    } catch (err) {
      throw new ServerErrorResponse();
    }
  }

  async deletePost({ id, userId }: AllKeySameType<string>) {
    try {
      const post = await this.blogModel.findOneAndDelete({ _id: id, userId });
      if (!post) throw new NotFoundException('Blog not found');

      return new SuccessResponse({
        message: 'Blog Deleted Successfully!',
      });
    } catch (err) {
      console.log(err)
      throw new ServerErrorResponse();
    }
  }
}
