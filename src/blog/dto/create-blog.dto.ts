import { Document, Types } from 'mongoose';

// This interface extends Document to include MongoDB-specific properties like _id
export interface Blog extends Document {
  title: string,
  createdBy: string,
  userId: Types.ObjectId,
  createdAt: Date,
  updatedAt: Date,
  body: string
}
