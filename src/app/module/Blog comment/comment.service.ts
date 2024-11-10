/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
// import { Blog } from "../tourBlog/blog.model";
import { TBlogComment } from "./comment.interface";

import { User } from "../User/user.model";
import mongoose from "mongoose";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { Blog } from "../Blog/blog.model";
import { BlogComment } from "./comment.model";

const createComment = async (payload: Partial<TBlogComment>) => {
  const { blogId, clerkId } = payload;

  const blogData = await Blog.findById(blogId);
  const userData = await User.findOne({ clerkId: clerkId });

  if (!blogData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid blog Id");
  }
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid userId");
  }

  const newPayload: {
    userId: mongoose.Types.ObjectId;
    comment: string | undefined;
    blogId: mongoose.Types.ObjectId;
    images?: string[];
  } = {
    userId: userData._id,
    comment: payload.comment,
    blogId: blogData._id,
  };

  if (payload.images) {
    newPayload.images = payload.images;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newComment] = await BlogComment.create([newPayload], {
      session,
    });

  const blogData=  await Blog.findByIdAndUpdate(
      blogId,
      { $push: { comments: newComment._id } },
      { new: true, session }
    );
console.log(blogData);
    await session.commitTransaction();
    session.endSession();

    return newComment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create comment"
    );
  }
};

const getCommentForBlog = async (
  blogId: string,
  query: Record<string, unknown>
) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new AppError(404, "Invalid blog Id");
  }
  const blogComment = new QueryBuilder(
    BlogComment.find({ blogId }).populate({
      path: "userId",
      select: "name image clerkId"
    }),
    query
  )
    .search(["comment"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await blogComment.modelQuery;
  const meta = await blogComment.countTotal();
  return { result, meta };
};

export const CommentServices = {
  createComment,
  getCommentForBlog,
};
