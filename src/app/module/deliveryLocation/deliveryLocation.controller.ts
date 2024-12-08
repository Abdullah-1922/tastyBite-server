import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DeliveryLocationService } from "./deliveryLocation.service";

const createDeliveryLocation = catchAsync(async (req, res) => {
  const result = await DeliveryLocationService.createDeliveryLocation(req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Delivery location created successfully",
    data: result,
    success: true,
  });
});

const getAllDeliveryLocations = catchAsync(async (req, res) => {
  const { result, meta } =
    await DeliveryLocationService.getAllDeliveryLocations(req.query);

  sendResponse(res, {
    statusCode: 200,
    message: "Delivery locations retrieved successfully",
    data: result,
    meta: meta,
    success: true,
  });
});

const getAllDeliveryLocationsByUser = catchAsync(async (req, res) => {
  const { result, meta } =
    await DeliveryLocationService.getAllDeliveryLocationsByUser(
      req.params.userId,
      req.query
    );

  sendResponse(res, {
    statusCode: 200,
    message: "Delivery locations by user retrieved successfully",
    data: result,
    meta: meta,
    success: true,
  });
});

const updateDeliveryLocation = catchAsync(async (req, res) => {
  const result = await DeliveryLocationService.updateDeliveryLocation(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Delivery location updated successfully",
    data: result,
    success: true,
  });
});

const deleteDeliveryLocationById = catchAsync(async (req, res) => {
  const result = await DeliveryLocationService.deleteDeliveryLocationById(
    req.params.id
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Delivery location deleted successfully",
    data: result,
    success: true,
  });
});

export const DeliveryLocationController = {
  createDeliveryLocation,
  getAllDeliveryLocations,
  getAllDeliveryLocationsByUser,
  updateDeliveryLocation,
  deleteDeliveryLocationById,
};
