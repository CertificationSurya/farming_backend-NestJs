import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/auth/dto/create-user.dto';
import { AllKeySameType } from 'src/common/definations';
import { IConversation } from 'src/common/dto/chat.dto';
import {
  ServerErrorResponse,
  SuccessResponse,
} from 'src/common/filters/Response.dto';
import { dbModels } from 'src/constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(dbModels.User) private userModel: Model<User>,
    @Inject(dbModels.Conversation)
    private conversationModel: Model<IConversation>,
  ) {}

  async getConversation(userId: string) {
    try {
      // const users = await this.userModel.find(
      //   { _id: { $ne: userId } }, // no currentUser
      //   { password: 0 }, // noPassword field
      // );

      const conversationUserIsIn = await this.conversationModel.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      });

      let chattedUserInfo = [];
      if (conversationUserIsIn) {
        const userSet = new Set();
        conversationUserIsIn.forEach((convo) => {
          if (convo.senderId.toHexString() != userId) {
            userSet.add(convo.senderId);
          } else {
            userSet.add(convo.receiverId);
          }
        });
        const chattedUserId = Array.from(userSet);

        chattedUserInfo = await this.userModel.find(
          { _id: { $in: chattedUserId } },
          'username email phoneNumber type profilePicId gender',
        );
      }

      return {
        message: 'retrieved users successfully',
        chattedUsers: chattedUserInfo,
      };
    } catch (err) {
      console.error(err);
      throw new ServerErrorResponse();
    }
  }

  async getUserInfo(userId: string) {
    try {
      const user = await this.userModel.findOne(
        { _id: userId },
        { password: 0 },
      );

      return new SuccessResponse({
        data: user,
        message: 'Fetched User Successfully!',
      });
    } catch (error) {
      throw new ServerErrorResponse();
    }
  }

  // update photo
  async updateUserDetails({
    profilePicId,
    userId,
  }: AllKeySameType<string>): Promise<SuccessResponse<User>> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: userId },
        { profilePicId },
        { new: true },
      );

      if (!updatedUser)
        throw new BadRequestException('User Not Found, Updation Failed!');

      // @ts-ignore
      const {_id, ...formattedUser} = updatedUser._doc

      return new SuccessResponse({
        //@ts-ignore
        data: {...formattedUser, userId},
        message: 'Successfully Updated Picture!',
      });
    } catch (error) {
      throw new ServerErrorResponse();
    }
  }
}
