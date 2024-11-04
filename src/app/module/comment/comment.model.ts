import mongoose from "mongoose";
import { TComment } from "./comment.interface";

const commentSchema = new mongoose.Schema<TComment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    comment: { type: String, required: true },
    images: { type: [String] },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<TComment>("Comment", commentSchema);
