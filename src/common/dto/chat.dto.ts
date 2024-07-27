import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
  text: string;
  seen: boolean;
  senderId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  messages: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
