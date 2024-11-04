import { Types } from "mongoose";

export interface TComment {
  userId: Types.ObjectId;

  foodId: Types.ObjectId;

  comment: string;
  
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}
