import { Types } from "mongoose";

export interface TBlogComment {
  userId: Types.ObjectId;
  clerkId?:string
  blogId: Types.ObjectId;

  comment: string;
   
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}
