import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

import { ReqWithCookieData, UserDataType } from 'src/common/definations';

Injectable();
export class FetchUser implements CanActivate {
  canActivate( context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {

    const req: ReqWithCookieData = context.switchToHttp().getRequest();
    const farmer_token = req.cookies.farmer_token;

    if (!farmer_token) {
      throw new UnauthorizedException('Unauthorized user - No token provided.');
    }

    try {
      const JWT_DATA = jwt.verify(
        farmer_token,
        process.env.JWT_SECRET,
      ) as jwt.JwtPayload;
      const { iat, exp, ...data } = JWT_DATA;
      
      req.userData = data as UserDataType;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error Occured');
    }

    return true;
  }
}
