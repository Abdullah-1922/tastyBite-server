import { Request, Response } from "express";
import {
  countTotalUnreadNotificationService,
  createNotification,
  deleteUserNotificationService,
  getNotificationsByUser,
  markNotificationAsRead,
  markToggleNotificationArchivedService,
} from "./notification.service";

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

export const addNotification = catchAsync(
  async (req: Request, res: Response) => {
    const notification = await createNotification(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  }
);

export const getUserNotifications = catchAsync(
  async (req: Request, res: Response) => {
    const { meta, result } = await getNotificationsByUser(
      req.params.userId,
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notifications retrieved successfully",
      data: result,
      meta,
    });
  }
);
export const deleteUserNotification = catchAsync(
  async (req: Request, res: Response) => {
    await deleteUserNotificationService(req.params.userId, req.query);
    sendResponse(res, {
      statusCode: httpStatus.NO_CONTENT,
      success: true,
      message: "Notification deleted successfully",
      data: null,
    });
  }
);

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await markNotificationAsRead(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification updated successfully",
    data: notification,
  });
});

export const markToggleNotificationArchived = catchAsync(
  async (req: Request, res: Response) => {
    const notification = await markToggleNotificationArchivedService(
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notification Archived toggle successfully",
      data: notification,
    });
  }
);
export const countTotalUnreadNotification = catchAsync(
  async (req: Request, res: Response) => {
    const notification = await countTotalUnreadNotificationService(
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notification unread notification get successfully",
      data: notification,
    });
  }
);
