import { Types } from "mongoose";

type TSize = {
  size: string;
  price: number;
  description?: string;
};
type TExtra = {
  name: string;
  extra_price: number;
};

export interface TFood {
  name: string;
  description: string;
  images: string[];
  price: number;
  menuId: Types.ObjectId;
  sizes: TSize[];
  extras: TExtra[];
  orders: Types.ObjectId[];
  comments: Types.ObjectId[];
  rating: Types.ObjectId[];
  averageRating: number;
  totalRating: number;
  createdAt: Date;
  updatedAt: Date;
}
