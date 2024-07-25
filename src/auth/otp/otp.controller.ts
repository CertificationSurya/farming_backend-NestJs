import { Body, Controller, ParseIntPipe, Post, Req } from '@nestjs/common';
import { OTPService } from './otp.service';
import { Request } from 'express';


@Controller('/auth/otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @Post()
  sendOTP(@Body() { email }: { email: string }, @Req() req:Request) {
    return this.otpService.sendOTP(email, req);
  }

  @Post('/verify')
  // @Body ('OTP') selects the OTP field in the body object
  verifyOTP(@Body('OTP', ParseIntPipe) OTP: number, @Req() req:Request) {
    return this.otpService.verifyOTP(OTP, req);
  }
}
