import {
  UseGuards,
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { FetchUser } from 'src/guards/AuthGuard';
import { User } from './dto/create-user.dto';
import { CookieInterceptor } from './cookie.interceptor';
import { SuccessResponse } from 'src/common/filters/Response.dto';
import { ReqWithCookieData } from 'src/common/definations';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(FetchUser)
  getUser(@Req() req: ReqWithCookieData) {
    const {userData} = req;
    return this.authService.getUser(userData);
  }

  @Post('/signup')
  @UseInterceptors(CookieInterceptor)
  async signUp(@Body() form: User) {
    const dbUser = await this.authService.signUp(form);
    // the return won't send the response because there's a CookieInterceptor that will take these return value and then perform some action and then only return response accordingly. In our case {message: data.message}
    return new SuccessResponse({
      data: dbUser,
      message: `successfully created a user named ${form.username}`,
    });
  }

  @Post('/login')
  @UseInterceptors(CookieInterceptor)
  async login(@Body() { email, password }: { email: string; password: string }) {

    const dbUser = await this.authService.login(email, password);

    return new SuccessResponse({
      data: dbUser,
      message: `Successfully logged In!`,
    });
  }

  @Get('/logout')
  @UseGuards(FetchUser)
  logout() {
    return this.authService.logout();
  }
}
