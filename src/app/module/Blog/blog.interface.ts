import { Types } from "mongoose";

export interface TBlog {
  user?: Types.ObjectId;
  blogCategory: "Fine Dining" | "Casual Dining" | "Fast Food" | "Cafe" | "Buffet" | "Food Truck";
  clerkId?: string;
  title: string;
  description: string;
  image: string;
  comments?: Types.ObjectId[];
}
