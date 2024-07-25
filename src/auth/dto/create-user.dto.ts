import { Document, Types } from 'mongoose';

// This interface extends Document to include MongoDB-specific properties like _id
export interface User extends Document {
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
