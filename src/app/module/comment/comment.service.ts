/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
// import { Food } from "../tourFood/food.model";
import { TComment } from "./comment.interface";
import { Comment } from "./comment.model";
import { User } from "../User/user.model";
import mongoose from "mongoose";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { Food } from "../Food/food.model";

const createComment = async (payload: Partial<TComment>) => {
  const { foodId, userId } = payload;

  const foodData = await Food.findById(foodId);
  const userData = await User.findById(userId);

  if (!foodData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid food Id");
  }
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid userId");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newComment] = await Comment.create([{ ...payload }], { session });

    await Food.findByIdAndUpdate(
      foodId,
      { $push: { comments: newComment._id } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return newComment;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create comment"
    );
  }
};

const getCommentForFood = async (
  foodId: string,
  query: Record<string, unknown>
) => {
  const food = await Food.findById(foodId);
  if (!food) {
    throw new AppError(404, "Invalid food Id");
  }
  const foodComment = new QueryBuilder(
    Comment.find({ foodId }).populate(["userId"]),
    query
  )
    .search(["comment"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await foodComment.modelQuery;
  const meta = await foodComment.countTotal();
  return { result, meta };
};

export const CommentServices = {
  createComment,
  getCommentForFood,
};
