import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StaffService } from "./staff.service";

const createStaff = catchAsync(async (req, res) => {
  const result = await StaffService.createStaff(req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Staff created successfully",
    data: result,
    success: true,
  });
});
const getAllStaff = catchAsync(async (req, res) => {
  const { meta, staff } = await StaffService.getAllStaff(req.query);

  sendResponse(res, {
    statusCode: 200,
    message: "Staff retrieved successfully",
    data: staff,
    meta: meta,
    success: true,
  });
});
export const StaffController = {
  createStaff,
  getAllStaff,
};
