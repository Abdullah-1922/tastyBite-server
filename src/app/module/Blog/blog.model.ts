import { model, Schema } from "mongoose";
import { TBlog } from "./blog.interface";
import {  BlogCategoryNames } from "./blog.constant";

const BlogSchema: Schema = new Schema<TBlog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blogCategory: { type: String,enum:BlogCategoryNames, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "BlogComment" }],
  },
  { timestamps: true }
);

export const Blog = model<TBlog>("Blog", BlogSchema);
