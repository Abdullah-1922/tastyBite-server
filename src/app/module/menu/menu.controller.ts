import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MenuServices } from "./menu.service";


const createMenu = catchAsync(async (req, res) => {
  const result = await MenuServices.createMenu(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Menu created successfully",
    data: result,
  });
});
const getAllMenu = catchAsync(async (req, res) => {
  const result = await MenuServices.getAllMenu();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Menu retrieved successfully",
    data: result,
  });
});
const getSingleMenu = catchAsync(async (req, res) => {
  const result = await MenuServices.getSingleMenu(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Menu retrieved successfully",
    data: result,
  });
});
const getFoodByMenu = catchAsync(async (req, res) => {
  const result = await MenuServices.getFoodByMenu(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Foods retrieved by menu successfully",
    data: result,
  });
});
const updateMenu = catchAsync(async (req, res) => {
  const result = await MenuServices.updateMenu(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Menu updated successfully",
    data: result,
  });
});
const deleteMenu = catchAsync(async (req, res) => {
  const result = await MenuServices.deleteMenu(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Menu deleted successfully",
    data: result,
  });
});

export const MenuControllers = {
  createMenu,
  getAllMenu,
  getSingleMenu,
  updateMenu,
  deleteMenu,
  getFoodByMenu
};
