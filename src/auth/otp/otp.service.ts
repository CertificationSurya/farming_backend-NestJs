import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Request } from 'express';

import SendMailOtp from 'src/common/utils/sendOTP.util';
import { dbModels } from 'src/constants';

import { User } from '../dto/create-user.dto';
import { SuccessResponse } from 'src/common/filters/Response.dto';

Injectable();
export class OTPService {
  constructor(@Inject(dbModels.User) private userModel: Model<User>) {}

  async sendOTP(email: string, req: Request) {
    const dbUser = await this.userModel.findOne({ email });
    if (dbUser) {
      throw new BadRequestException(`User with ${dbUser.email} already exists`);
    }

    try {
      const SixDigitcode = await SendMailOtp(email);
      // @ts-ignore
      req.session.otp = SixDigitcode;

      if (SixDigitcode)
        return new SuccessResponse({ message: 'OTP sent successfully' });
    } catch (err) {
      console.log(err)
      throw new BadRequestException(err.message);
    }
  }

  verifyOTP(OTP: number, req: Request) {
    // @ts-ignore
    if (req.session.otp == OTP) {
      return new SuccessResponse({
        message: "User authenticated successfully"
      })
		}

    throw new BadRequestException("User authenticated successfully");
  }
}
