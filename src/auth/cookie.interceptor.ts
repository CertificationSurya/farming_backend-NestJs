import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import * as jwt from 'jsonwebtoken';

import { SuccessResponse } from 'src/common/filters/Response.dto';
import { User } from './dto/create-user.dto';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe( map((data: SuccessResponse<User>) => {
        if (data && data.data) {
          // console.log(data.data)

          // @ts-ignore
          const { userId, password, __v, ...cookieData } = data.data;
          const profilePicId = (data.data as User).profilePicId ;

          const tokenData = {
            ...cookieData,
            profilePicId,
            userId,
          };

          const farmerToken = jwt.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: '7d',
          });

          // Set the cookie
          response.cookie('farmer_token', farmerToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          });

          return {
            message: data.message,
          };
        }
        
        return data;
      }),
    );
  }
}
