/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilder } from "../../builder/QueryBuilder";
import { TFeedBack } from "./feedback.interface";
import { Feedback } from "./feedback.model";

const createFeedback = async (feedback: TFeedBack) => {
  const newFeedback = await Feedback.create(feedback);
  return newFeedback;
};

const getAllFeedback = async (query: any) => {
  const feedbackQuery = new QueryBuilder(Feedback.find(), query)
    .filter()
    .sort()
    .fields()
    .search(["name", "email", "feedback"])
    .paginate();

  const feedback = await feedbackQuery.modelQuery;

  const meta = await feedbackQuery.countTotal();

  return { feedback, meta };
};

export const FeedbackService = {
  createFeedback,
  getAllFeedback,
};
