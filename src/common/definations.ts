import { Request } from "express";
import { Session, SessionData} from "express-session";
import { IUser } from "src/auth/dto/create-user.dto";

export type AllKeySameType<T> = {
  [key: string]: T;
};

export type UserDataType = Omit<IUser, "password"> & {
    userId: string
}

export interface ReqWithCookieData extends Request {
  userData: UserDataType,
}
export interface ReqWithSessionOTP extends Request {
  session: Session & Partial<SessionData> & {
    otp: number
  }
}