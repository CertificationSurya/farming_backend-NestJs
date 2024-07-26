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
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';

import { MarketplaceService } from './marketplace.service';

import type { AllKeySameType } from '../common/definations';
import { Request, Response } from 'express';
import { FetchUser } from 'src/guards/AuthGuard';
import { SuccessResponse } from 'src/common/filters/Response.dto';
import { CreateMarketplaceDto } from './dto/create-marketplace.dto';
import { UpdateMarketplaceDto } from './dto/update-marketplace.dto';

// import fileUpload from 'src/common/Interceptors/fileUpload.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFile } from '../common/Interceptors/fileUpload.interceptor';
import fileDownload from 'src/common/Interceptors/fileDownload.interceptor';

@Controller('/marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  async getAllPosts() {
    return await this.marketplaceService.getAllPost();
  }

  @Get('/posts')
  @UseGuards(FetchUser)
  getUserPosts(@Req() req: Request) {
    //@ts-ignore
    const { userId }: { userId: string } = req.userData;

    return this.marketplaceService.getUserPosts(userId);
  }

  @Get('/:itemId')
  getSinglePost(@Param('itemId') itemId: string) {
    return this.marketplaceService.getSinglePost(itemId);
  }

  @Get('/related-item/:itemType')
  getRelatedPosts(@Param('itemType') itemType: string) {
    return this.marketplaceService.getRelatedItems(itemType);
  }

  @Post()
  @UseGuards(FetchUser)
  async createPost(
    @Body() { itemName, price, details, type, itemType }: CreateMarketplaceDto,
    @Req() req: Request,
  ) {
    // @ts-ignore
    const { userId, username: postedBy, location }: AllKeySameType<string> = req.userData;

    const res = await this.marketplaceService.createPost(
      { itemName, price, details, type, itemType },
      { userId, postedBy, location },
    );
    return res;
  }

  // upload photo
  // @Patch('/img/:productId')
  // @UseInterceptors(
  //   FileInterceptor('productImg', {
  //     // storage: fileUpload,
  //   }),
  // )
  // updatePhotoToPost(
  //   @Param('productId') productId: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   // @ts-ignore
  //   const pictureId = file.id as string;
  //   return this.marketplaceService.uploadProductImage({ productId, pictureId });
  // }

  // photo download
  @Get('/img/:photoId')
  downloadPhoto(@Param('photoId') photoId: string, @Res() res: Response) {
    return fileDownload(photoId, res);
  }

  // Photo upload
  @UseInterceptors(FileInterceptor('productImg'))
  @Patch('/:itemId')
  @UseGuards(FetchUser)
  async updatePhotoLink(
    @Param('itemId') itemId: string,
    @UploadedFile() productImg: Express.Multer.File,
  ) {
    const pictureId = await uploadFile(productImg);

    return this.marketplaceService.uploadProductImage({
      productId: itemId,
      pictureId,
    });
  }

  @Delete('/:itemId')
  // @UseGuards(FetchUser)
  deletePost(@Param('itemId') itemId: string, @Req() req:Request) {
    //@ts-ignore
    const { userId } = req.userData;

    return this.marketplaceService.deletePost({ itemId, userId });
  }
}
