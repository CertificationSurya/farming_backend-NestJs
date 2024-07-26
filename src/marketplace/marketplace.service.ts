import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { dbModels } from 'src/constants';

// normies
import {
  ServerErrorResponse,
  SuccessResponse,
} from 'src/common/filters/Response.dto';
import { AllKeySameType } from '../common/definations';
import {
  CreateMarketplaceDto,
  Marketplace,
} from './dto/create-marketplace.dto';
import { UpdateMarketplaceDto } from './dto/update-marketplace.dto';

Injectable();
export class MarketplaceService {
  constructor(
    @Inject(dbModels.Marketplace) private marketplaceModel: Model<Marketplace>,
  ) {}

  async getAllPost(): Promise<
    SuccessResponse<Marketplace[]> | ServerErrorResponse
  > {
    try {
      const data = await this.marketplaceModel
        .find()
        .sort({ updatedAt: -1 })
        .exec();
      return new SuccessResponse<Marketplace[]>({
        data,
        message: 'Successfully retrieved blogs',
      });
    } catch (error) {
      throw new ServerErrorResponse();
    }
  }

  async getUserPosts(userId: string) {
    try {
      const data = await this.marketplaceModel
        .find({ userId })
        .sort({ updatedAt: -1 });

      if (data)
        return new SuccessResponse<Marketplace[]>({
          data,
        });
    } catch (error) {
      console.log(error);
      throw new ServerErrorResponse();
    }
  }

  async getRelatedItems(itemType: string) {
    try {
      const data = await this.marketplaceModel
        .find({ itemType })
        .sort({ updatedAt: -1 });

      if (data)
        return new SuccessResponse<Marketplace[]>({
          data,
        });
    } catch (error) {
      console.log(error);
      throw new ServerErrorResponse();
    }
  }

  async createPost(
    { itemName, price, details, type, itemType }: CreateMarketplaceDto,
    { userId, postedBy, location }: AllKeySameType<string>,
  ) {
    try {
      const newMarketPost = new this.marketplaceModel({
        userId,
        postedBy,
        itemType,
        itemName,
        price,
        details,
        location,
        type,
      });

      await newMarketPost.save();
      console.log(newMarketPost);

      return new SuccessResponse<Marketplace>({
        data: newMarketPost,
        message: 'Your Post has been created',
      });
    } catch (err) {
      throw new ServerErrorResponse();
    }
  }

  async getSinglePost(itemId: string) {
    try {
      const post = await this.marketplaceModel.findById(itemId);
      if (!post) throw new NotFoundException('Post Not Found!');

      return new SuccessResponse<Marketplace>({
        data: post,
        message: 'Post found successfully!',
      });
    } catch (err) {
      console.log(err);
      throw new ServerErrorResponse();
    }
  }

  async uploadProductImage({ productId, pictureId }: AllKeySameType<string>) {
    try {
      const data = await this.marketplaceModel.findOneAndUpdate(
        { _id: productId },
        { pictureId },
        { new: true },
      );
      if (!data) throw new NotFoundException('Product not found');
  
      return new SuccessResponse<Marketplace>({
        data,
        message: 'Successfully Updated Picture!',
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      if (err.name === 'CastError') {
        throw new BadRequestException('Invalid product ID');
      }
      throw new ServerErrorResponse();
    }
  }

  async updatePost(
    { itemId, userId }: AllKeySameType<string>,
    updateFields: UpdateMarketplaceDto,
  ): Promise<SuccessResponse<Marketplace>> {
    try {
      updateFields.userId = userId;

      const updatedMarketPost = await this.marketplaceModel.findByIdAndUpdate(
        itemId,
        updateFields,
        { new: true, runValidators: true },
      );

      if (!updatedMarketPost) throw new BadRequestException('Post Not found');

      return new SuccessResponse({
        message: 'Post Updated Successfully',
        data: updatedMarketPost,
      });
    } catch (err) {
      throw new ServerErrorResponse();
    }
  }

  async deletePost({ itemId, userId }: AllKeySameType<string>) {
    try {
      const post = await this.marketplaceModel.findOneAndDelete({
        _id: itemId,
        userId,
      });
      if (!post) throw new NotFoundException('Market Post not found');

      return new SuccessResponse({
        message: 'Market Post Deleted Successfully!',
      });
    } catch (err) {
      throw new ServerErrorResponse();
    }
  }
}
