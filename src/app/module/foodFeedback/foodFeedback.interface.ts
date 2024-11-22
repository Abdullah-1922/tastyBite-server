import { Types } from "mongoose";

export type TFoodFeedback = {
  _id?: string;
  user: Types.ObjectId;
  clerkId?: string;
  foodId: string;
  title: string;
  review: string;
  rating: number;
};
