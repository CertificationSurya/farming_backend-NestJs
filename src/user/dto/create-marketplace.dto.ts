import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';
import { Document, Types } from 'mongoose';

enum ItemType {
  PRODUCT = 'product',
  SERVICE = 'service',
  // Add other item types as needed
}

export class CreateMarketplaceDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  details: string;

  @IsString()
  type: string;

  @IsEnum(ItemType)
  @IsNotEmpty()
  itemType: ItemType;
}

export interface Marketplace extends Document {
  userId: Types.ObjectId;
  postedBy: string;
  itemName: string;
  itemType: 'animal' | 'product' | 'tool' | 'machinery';
  pictureId: Types.ObjectId | null;
  price: number;
  details: string;
  location: string;
  type: 'sale' | 'rent';
  createdAt: Date;
  updatedAt: Date;
}