import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import SendMailOtp from 'src/common/utils/sendOTP.util';
import { dbModels } from 'src/constants';

import { User } from '../dto/create-user.dto';
import { SuccessResponse } from 'src/common/filters/Response.dto';

import { ReqWithSessionOTP } from 'src/common/definations';

Injectable();
export class OTPService {
  constructor(@Inject(dbModels.User) private userModel: Model<User>) {}

  async sendOTP(email: string, req: ReqWithSessionOTP) {
    const dbUser = await this.userModel.findOne({ email });
    if (dbUser) {
      throw new BadRequestException(`User with ${dbUser.email} already exists`);
    }

    try {
      const SixDigitcode = await SendMailOtp(email);
      req.session.otp = SixDigitcode;

      if (SixDigitcode)
        return new SuccessResponse({ message: 'OTP sent successfully' });
    } catch (err) {
      console.log(err)
      throw new BadRequestException(err.message);
    }
  }

  verifyOTP(OTP: number, req: ReqWithSessionOTP) {
    if (req.session.otp == OTP) {
      return new SuccessResponse({
        message: "User authenticated successfully"
      })
		}

    throw new BadRequestException("User authenticated successfully");
  }
}
