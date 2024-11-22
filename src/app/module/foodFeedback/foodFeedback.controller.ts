import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { FoodFeedbackServices } from "./foodFeedback.service";
import sendResponse from "../../utils/sendResponse";

const createFeedback = catchAsync(async (req, res) => {
    const result = await FoodFeedbackServices.createFeedback(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback created successfully",
        data: result,
    });
});

const getAllFeedbackByFoodId = catchAsync(async (req, res) => {
    const { foodId } = req.params;
    const {feedbacks,meta} = await FoodFeedbackServices.getAllFeedbackByFoodId(foodId, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback retrieved successfully",
        data:feedbacks,
        meta:meta
    });
});
const getAllFeedback = catchAsync(async (req, res) => {
    
    const {feedbacks,meta} = await FoodFeedbackServices.getAllFeedback( req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback retrieved successfully",
        data:feedbacks,
        meta:meta
    });
});

const updateFeedback = catchAsync(async (req, res) => {
    const { feedbackId } = req.params;
    const result = await FoodFeedbackServices.updateFeedback(feedbackId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback updated successfully",
        data: result,
    });
});

const deleteFeedback = catchAsync(async (req, res) => {
    const { feedbackId } = req.params;
    const result = await FoodFeedbackServices.deleteFeedback(feedbackId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feedback deleted successfully",
        data: result,
    });
});

export const FoodFeedbackControllers = {
    createFeedback,
    getAllFeedbackByFoodId,
    updateFeedback,
    deleteFeedback,
    getAllFeedback
};
