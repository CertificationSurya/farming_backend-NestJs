import {
  Controller,
  Get,
  Param,
  Patch,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FetchUser } from 'src/guards/AuthGuard';
import fileDownload from 'src/common/Interceptors/fileDownload.interceptor';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFile } from 'src/common/Interceptors/fileUpload.interceptor';
import { CookieInterceptor } from 'src/auth/cookie.interceptor';
import { ReqWithCookieData } from 'src/common/definations';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId')
  getUserInfo(@Param('userId') userId: string) {
    return this.userService.getUserInfo(userId);
  }

  @Get('/conversation/:userId')
  @UseGuards(FetchUser)
  getConversation(@Param('userId') userId: string) {
    return this.userService.getConversation(userId);
  }

  @Get('/img/:photoId')
  getPhoto(@Param('photoId') photoId: string, @Res() res: Response) {
    return fileDownload(photoId, res);
  }

  // upload photo
  @Patch('/img')
  @UseInterceptors(FileInterceptor('profilePic'))
  @UseGuards(FetchUser)
  @UseInterceptors(CookieInterceptor)
  async updateUserDetails(@UploadedFile() profilePic: Express.Multer.File, @Req() req: ReqWithCookieData) {
    const { userId } = req.userData;
    const profilePicId = await uploadFile(profilePic);

    return this.userService.updateUserDetails({ profilePicId, userId });
  }
}
