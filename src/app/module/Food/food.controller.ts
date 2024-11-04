import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { FoodServices } from "./food.service";
import sendResponse from "../../utils/sendResponse";

const createFood = catchAsync(async (req, res) => {
  const result = await FoodServices.createFood(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Food is created successfully",
    data: result,
  });
});

// get all food
const getAllFood = catchAsync(async (req, res) => {
  const result = await FoodServices.getAllFood(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Food retrieved successfully",
    data: result,
  });
});

// delete food using id.......
const deleteFoodWithId = catchAsync(async (req, res) => {
  const foodId = req.params.foodId;

  const result = await FoodServices.deleteSingleFood(foodId);
  res.status(200).json({
    success: true,
    message: "food data deleted successfully!",
    data: result,
  });
});
const getSingleFood = catchAsync(async (req, res) => {
  const foodId = req.params.foodId;
  console.log(foodId);
  const result = await FoodServices.getSingleFood(foodId);
  res.status(200).json({
    success: true,
    message: "food retrieved successfully!",
    data: result,
  });
});
const updateFood = catchAsync(async (req, res) => {
  const foodId = req.params.foodId;
  const result = await FoodServices.updateFood(foodId, req.body);
  res.status(200).json({
    success: true,
    message: "food updated successfully !",
    data: result,
  });
});

export const FoodControllers = {
  createFood,
  getAllFood,
  deleteFoodWithId,
  getSingleFood,
  updateFood,
};
