import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is created successfully",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {

  // const currentUser = req.headers["clerkid"] as string;
  // const result = await UserServices.updateUserRole(req.params.id,req.body,currentUser);
  const result = await UserServices.updateUserRole(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUser(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});
const getSingleUser = catchAsync(async (req, res) => {
  const result = await UserServices.getSingleUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});
const updateUser = catchAsync(async (req, res) => {
  const result = await UserServices.updateUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});
const createStripeUser = catchAsync(async (req, res) => {
  const result = await UserServices.createStripeUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stripe user created successfully",
    data: result,
  });
});
const getStripeUser = catchAsync(async (req, res) => {
  const result = await UserServices.getStripeUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stripe user retrieved successfully",
    data: result,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const result = await UserServices.deleteUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});
const monthlyUserCount = catchAsync(async (req, res) => {
  const result = await UserServices.monthlyUserCount();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monthly user count stats retrieved successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  createStripeUser,
  getStripeUser,
  updateUserRole,
  deleteUser,
  monthlyUserCount
};
