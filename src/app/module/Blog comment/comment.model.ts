import mongoose from "mongoose";
import { TBlogComment } from "./comment.interface";

const commentSchema = new mongoose.Schema<TBlogComment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },

    comment: { type: String, required: true },
    images: { type: [String] },
  },
  { timestamps: true }
);

export const BlogComment = mongoose.model<TBlogComment>("BlogComment", commentSchema);
