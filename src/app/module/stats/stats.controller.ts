import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatsServices } from "./stats.services";

const getAllStats = catchAsync(async (req, res) => {
  const result = await StatsServices.getAllStats();

  sendResponse(res, {
    data: result,
    message: "Stats fetched successfully",
    statusCode: 200,
    success: true,
  });
});
export const StatsController = {
    getAllStats,
    };