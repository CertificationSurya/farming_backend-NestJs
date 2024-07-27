import { Document, Types } from 'mongoose';

export interface IUser {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  description?: string;
  location: string;
  gender: 'Male' | 'Female'; 
  profilePicId?: Types.ObjectId | null;
  type: 'Farmer' | 'Expert'; 
}

export interface User extends IUser, Document {}