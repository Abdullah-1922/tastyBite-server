import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { User } from "../User/user.model";

import { TFoodFeedback } from "./foodFeedback.interface";
import FoodFeedback from "./foodFeedback.model";

const createFeedback = async (payload: Partial<TFoodFeedback>) => {
  if (!payload.foodId) {
    throw new AppError(400, "Food ID is required");
  }
  if (!payload.clerkId) {
    throw new AppError(400, "Clerk ID is required");
  }

 
  const user = await User.findOne({ clerkId: payload.clerkId });

  if (!user) {
    throw new AppError(404, "User not found");
  }
  payload.user = user._id;
  const feedback = await FoodFeedback.create(payload);
  return feedback;
};

const getAllFeedbackByFoodId = async (
  foodId: string,
  query: Record<string, unknown>
) => {
  if (!foodId) {
    throw new AppError(400, "Food ID is required");
  }

  const feedbackQuery = new QueryBuilder(
    FoodFeedback.find({ foodId }).populate(["user"]),
    query
  )
    .search(["title", "review"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const feedbacks = await feedbackQuery.modelQuery;
  const meta = await feedbackQuery.countTotal();
  return { feedbacks, meta };
};
const getAllFeedback = async (query: Record<string, unknown>) => {
  const feedbackQuery = new QueryBuilder(
    FoodFeedback.find().populate(["user"]),
    query
  )
    .search(["title", "review"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const feedbacks = await feedbackQuery.modelQuery;
  const meta = await feedbackQuery.countTotal();
  return { feedbacks, meta };
};

const updateFeedback = async (id: string, payload: Partial<TFoodFeedback>) => {
  const feedback = await FoodFeedback.findById(id);
  if (!feedback) {
    throw new AppError(404, "Feedback not found");
  }
  const updatedFeedback = await FoodFeedback.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedFeedback;
};

const deleteFeedback = async (id: string) => {
  const feedback = await FoodFeedback.findById(id);
  if (!feedback) {
    throw new AppError(404, "Feedback not found");
  }
  const deletedFeedback = await FoodFeedback.findByIdAndDelete(id);
  return deletedFeedback;
};

export const FoodFeedbackServices = {
  createFeedback,
  getAllFeedbackByFoodId,
  updateFeedback,
  deleteFeedback,
  getAllFeedback,
};
