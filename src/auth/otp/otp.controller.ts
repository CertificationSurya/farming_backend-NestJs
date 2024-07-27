import { Body, Controller, ParseIntPipe, Post, Req } from '@nestjs/common';
import { OTPService } from './otp.service';
import { ReqWithSessionOTP } from 'src/common/definations';


@Controller('/auth/otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @Post()
  sendOTP(@Body() { email }: { email: string }, @Req() req:ReqWithSessionOTP) {
    return this.otpService.sendOTP(email, req);
  }

  @Post('/verify')
  // @Body ('OTP') selects the OTP field in the body object
  verifyOTP(@Body('OTP', ParseIntPipe) OTP: number, @Req() req: ReqWithSessionOTP) {
    return this.otpService.verifyOTP(OTP, req);
  }
}
