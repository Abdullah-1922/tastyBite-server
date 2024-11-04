import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FeedbackService } from "./feedback.service";

const createFeedback = catchAsync(async (req, res) => {
  const result = await FeedbackService.createFeedback(req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Feedback created successfully",
    data: result,
    success: true,
  });
});
const getAllFeedback = catchAsync(async (req, res) => {
  const {meta,feedback} = await FeedbackService.getAllFeedback(req.query);

  sendResponse(res, {
    statusCode: 200,
    message: "Feedback retrieved successfully",
    data: feedback,
    meta: meta,
    success: true,
  });
});
export const FeedbackController = {
  createFeedback,
  getAllFeedback
};
