/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { pusherServer } from "../../utils/pusher";
import { User } from "../User/user.model";
import { INotification } from "./notification.interface";
import Notification from "./notification.model";
export const createNotification = async (data: INotification) => {
  if (data.user && !mongoose.Types.ObjectId.isValid(data.user)) {
    const user = await User.findOne({ clerkId: data.user });

    if (!user) {
      throw new AppError(404, "User not found");
    }
    data.user = user._id;
  }

  if (!data.user) return;

  const notification = new Notification(data);
  const notificationResult = await notification.save();

  const clerkUser = await User.findById(data.user);

  if (!clerkUser)
    throw new AppError(
      404,
      "User not found in the database. Please check the details and try again."
    );

  try {
    await pusherServer.trigger(
      clerkUser?.clerkId,
      "notification:new",
      notificationResult
    );
  } catch (error: any) {
    throw new AppError(500, error?.message);
  }

  return notificationResult;
};

export const getNotificationsByUser = async (userId: string, query: any) => {
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  // Remove undefined values from query object
  Object.keys(query).forEach((key) => {
    if (query[key] === "undefined") {
      delete query[key];
    }
  });

  if (query.isArchived) {
    query.isArchived = query.isArchived === "true" ? true : false;
  }
  if (query.isRead) {
    query.isRead = query.isRead === "true" ? true : false;
  }

  const notificationQuery = new QueryBuilder(
    Notification.find({ user: user._id }),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await notificationQuery.modelQuery;
  const meta = await notificationQuery.countTotal();

  return { result, meta };
};
export const deleteUserNotificationService = async (
  userId: string,
  query: any
) => {
  let onlyArchived = false;
  let onlyUnread = false;

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  Object.keys(query).forEach((key) => {
    if (query[key] === "undefined") {
      delete query[key];
    }
  });

  if (query.isArchived && query.isArchived === "true") {
    onlyArchived = true;
  }
  if (query.isRead && query.isRead === "false") {
    onlyUnread = true;
  }

  if (onlyUnread) {
    return await Notification.deleteMany({
      user: user._id,
      isRead: false,
    });
  }

  if (onlyArchived) {
    return await Notification.deleteMany({
      user: user._id,
      isArchived: true,
    });
  }
  return await Notification.deleteMany({ user: user._id });
};

export const markNotificationAsRead = async (notificationId: string) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
};
export const markToggleNotificationArchivedService = async (
  notificationId: string
) => {
  const notification = await Notification.findById(notificationId);
  return await Notification.findByIdAndUpdate(
    notificationId,
    { isArchived: !notification?.isArchived },
    { new: true }
  );
};
export const countTotalUnreadNotificationService = async (userId: string) => {
  const user = await User.findOne({ clerkId: userId });

  const countUnreadNotification = await Notification.find({
    user: user?._id,
    isRead: false,
  }).countDocuments();
  return countUnreadNotification;
};
