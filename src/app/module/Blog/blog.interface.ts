import { Types } from "mongoose";

export interface TBlog {
  user?: Types.ObjectId;
  blogCategory: string;
  clerkId?: string;
  title: string;
  description: string;
  image: string;
}
