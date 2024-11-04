/* eslint-disable @typescript-eslint/no-unused-vars */
import { clerkClient } from "@clerk/clerk-sdk-node";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { TStripeUser, TUser } from "./user.interface";
import { StripeUser, User } from "./user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

import { Comment } from "../comment/comment.model";
import { Blog } from "../Blog/blog.model";

const createUser = async (userPayload: TUser) => {
  const result = await User.create(userPayload);
  console.log(result);
  if (userPayload.clerkId) {
    await clerkClient.users.updateUserMetadata(userPayload.clerkId, {
      publicMetadata: {
        role: "user",
      },
    });
  }
  return result;
};
const updateUserRole = async (clerkId: string, currentUserId: string) => {
  // if(clerkId == process.env.SUPER_ADMIN){
  //   throw new AppError(httpStatus.BAD_REQUEST,"Can not change super admin status")
  // }
  //   const currentUser = await User.findOne({ clerkId: currentUserId }).select(
  //     "role"
  //   );
  //   let userRoll: string = "";
  //   if (currentUser?.role !== "admin" && currentUser?.role !== "superadmin") {
  //     throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  //   }
  //   const requestedUser = await User.findOne({ clerkId: clerkId });
  //   if (!requestedUser) {
  //     throw new AppError(httpStatus.NOT_FOUND, "User not found");
  //   }
  //   if (requestedUser.role === "superadmin") {
  //     throw new AppError(httpStatus.BAD_REQUEST, "Cannot update superadmin role");
  //   }
  //   if (requestedUser.role === "admin") {
  //     userRoll = "user";
  //     await User.findByIdAndUpdate(requestedUser._id, { role: "user" });
  //   }
  //   if (requestedUser.role === "user") {
  //     userRoll = "admin";
  //     await User.findByIdAndUpdate(requestedUser._id, { role: "admin" });
  //   }
  //   if (clerkId) {
  //     await clerkClient.users.updateUserMetadata(clerkId, {
  //       publicMetadata: {
  //         role: userRoll,
  //       },
  //     });
  //   }
  //   const updatedRequestedUser = await User.findOne({ clerkId: clerkId });
  //   return updatedRequestedUser;
};

const deleteUser = async (id: string) => {
  const user = await User.findOne({ clerkId: id });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid clerk ID");
  }

  const result = await User.deleteOne({ clerkId: id });
  if (result) {
    // await Package.deleteMany({ clerkId: id });
    // await Booking.deleteMany({ clerkId: id });
    await StripeUser.deleteMany({ clerkId: id });
    await Comment.deleteMany({ clerkId: id });
    await Blog.deleteMany({ clerkId: id });
    await clerkClient.users.deleteUser(id);
  }

  return result;
};

const getAllUser = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find({}), query)
    .search(["email", "name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;

  return result;
};
const getSingleUser = async (id: string) => {
  const result = await User.find({ clerkId: id });

  return result;
};
const updateUser = async (payload: TUser) => {
  const user = await User.findOne({ clerkId: payload.clerkId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid clerk ID");
  }

  type TUserProfile = {
    firstName?: string;
    imageUrl?: string;
    email?: string;
  };

  const userProfile: TUserProfile = {};

  if (payload.name) {
    userProfile.firstName = payload.name;
  }

  if (payload.image) {
    userProfile.imageUrl = payload.image;
  }

  console.log(userProfile);
  const clerkRes = await clerkClient.users.updateUser(
    payload.clerkId as string,
    userProfile
  );

  if (!clerkRes) {
    throw new AppError(500, "failed to update user clerk profile");
  }

  const result = await User.findByIdAndUpdate(user._id, payload, { new: true });
  return result;
};

//////////// stripeUser.service.ts////////////////
const createStripeUser = async (payload: TStripeUser) => {
  const user = await StripeUser.findOne({ clerkId: payload.clerkId });

  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const result = await StripeUser.create(payload);

  return result;
};

const getStripeUser = async (id: string) => {
  const user = await StripeUser.findOne({ clerkId: id });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Stripe User not found");
  }
  return user;
};

const monthlyUserCount = async () => {
  // Get the current date and determine the current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getUTCMonth(); // Get current month index (0-11)

  // Initialize the count for each month to zero
  const monthlyUserCounts = Array(12).fill(0);

  // Get all users created in the current year
  const users = await User.find({
    createdAt: {
      $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
      $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
    },
  });

  // Count users for each month
  users.forEach((user) => {
    const month = new Date(user.createdAt).getUTCMonth(); // Get month index (0-11)
    monthlyUserCounts[month]++;
  });

  // Prepare the chart data for the total users for all 12 months
  const chartData = [
    { month: "January", users: monthlyUserCounts[0] },
    { month: "February", users: monthlyUserCounts[1] },
    { month: "March", users: monthlyUserCounts[2] },
    { month: "April", users: monthlyUserCounts[3] },
    { month: "May", users: monthlyUserCounts[4] },
    { month: "June", users: monthlyUserCounts[5] },
    { month: "July", users: monthlyUserCounts[6] },
    { month: "August", users: monthlyUserCounts[7] },
    { month: "September", users: monthlyUserCounts[8] },
    { month: "October", users: monthlyUserCounts[9] },
    { month: "November", users: monthlyUserCounts[10] },
    { month: "December", users: monthlyUserCounts[11] },
  ];

  // Get user counts for the last month and the month before last
  const lastMonthIndex =
    currentMonthIndex - 1 >= 0 ? currentMonthIndex - 1 : 11; // Last month (handle January wrap around)
  const previousMonthIndex = lastMonthIndex - 1 >= 0 ? lastMonthIndex - 1 : 11; // Month before last

  const lastMonthCount = monthlyUserCounts[lastMonthIndex];
  const previousMonthCount = monthlyUserCounts[previousMonthIndex];

  // Calculate percentage change between last month and the month before last
  let status = "no change";
  let percentage = 0;

  if (previousMonthCount > 0) {
    percentage =
      ((lastMonthCount - previousMonthCount) / previousMonthCount) * 100;
    status =
      percentage > 0 ? "increase" : percentage < 0 ? "decrease" : "no change";
  } else if (lastMonthCount > 0) {
    // If the month before last has zero users, treat any new users in the last month as an increase
    percentage = 100;
    status = "increase";
  }

  // Prepare the final result
  const result = {
    chartData,
    lastMonthStats: {
      totalUsers: lastMonthCount, // Total users for the last month
      status,
      percentage: Math.abs(percentage), // Use absolute value for percentage
    },
  };

  return result;
};

export const UserServices = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  createStripeUser,
  getStripeUser,
  updateUserRole,
  deleteUser,
  monthlyUserCount,
};
