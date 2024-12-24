import AppError from "../../errors/AppError";
import { Food } from "../Food/food.model";
import { Order } from "../order/order.model";
import { Staff } from "../staff/staff.model";
import { User } from "../User/user.model";

const getAllStats = async () => {
  const totalSell = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSell: { $sum: "$totalPrice" },
      },
    },
  ]);
  const totalRecipe = await Food.find().countDocuments();

  const totalCompletedOrders = await Order.find({
    isCompleted: true,
  }).countDocuments();
  const totalPendingOrders = await Order.find({
    isCompleted: false,
    isCancelled: false,
  }).countDocuments();
  const totalCancelledOrders = await Order.find({
    isCancelled: true,
  }).countDocuments();
  const totalOrders = await Order.find().countDocuments();
  const totalUsers = await User.find({ role: "user" }).countDocuments();
  const totalDeliveryMan = await User.find({
    role: "delivery man",
  }).countDocuments();
  const totalStaff = await Staff.find().countDocuments();
  const recipeBasedSell = await Order.aggregate([
    {
      $unwind: "$foods", // Unwind the foods array
    },
    {
      $lookup: {
        from: "foods", // Replace with your actual Foods collection name
        localField: "foods.foodId",
        foreignField: "_id",
        as: "foodDetails",
      },
    },
    {
      $unwind: {
        path: "$foodDetails", // Unwind the foodDetails array
        preserveNullAndEmptyArrays: true, // Preserve if no match is found
      },
    },
    {
      $group: {
        _id: "$foods.foodId", // Group by foodId
        totalSell: {
          $sum: { $multiply: ["$foods.quantity", "$foodDetails.price"] },
        }, // Calculate total sales price
        name: { $first: "$foodDetails.name" }, // Take the first food name
      },
    },
  ]);

  const recipeBasedOrders = await Order.aggregate([
    {
      $unwind: "$foods", // Unwind the foods array
    },
    {
      $lookup: {
        from: "foods", // Replace with your actual Foods collection name
        localField: "foods.foodId",
        foreignField: "_id",
        as: "foodDetails",
      },
    },
    {
      $unwind: {
        path: "$foodDetails", // Unwind the foodDetails array
        preserveNullAndEmptyArrays: true, // Preserve if no match is found
      },
    },
    {
      $group: {
        _id: "$foods.foodId", // Group by foodId
        totalOrders: { $sum: 1 }, // Count the number of orders for each food
        name: { $first: "$foodDetails.name" }, // Take the first food name
      },
    },
  ]);
  const allStats = {
    totalSell,
    totalRecipe,
    totalCompletedOrders,
    totalPendingOrders,
    totalCancelledOrders,
    totalOrders,
    totalUsers,
    totalDeliveryMan,
    totalStaff,
    recipeBasedSell,
    recipeBasedOrders,
  };

  return allStats;
};

const getStatsForUser = async (userId: string) => {
  const user = await User.findOne({ clerkId: userId });

  const totalOrders = await Order.find({ user: user?._id }).countDocuments();
  const runningOrders = await Order.find({
    user: user?._id,
    isCompleted: false,
    isCancelled: false,
  }).countDocuments();
  const cancelledOrders = await Order.find({
    user: user?._id,
    isCancelled: true,
  }).countDocuments();
  const completedOrders = await Order.find({
    user: user?._id,
    isCompleted: true,
  }).countDocuments();

  const userStats = {
    totalOrders,
    runningOrders,
    cancelledOrders,
    completedOrders,
  };

  return userStats;
};
const topThreeFoods = async () => {
  const topThreeFoods = await Order.aggregate([
    {
      $unwind: "$foods", // Unwind the foods array
    },
    {
      $lookup: {
        from: "foods", // Replace with your actual Foods collection name
        localField: "foods.foodId",
        foreignField: "_id",
        as: "foodDetails",
      },
    },
    {
      $unwind: { path: "$foodDetails", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "menus", // Replace with your actual Menus collection name
        localField: "foodDetails.menuId",
        foreignField: "_id",
        as: "menuDetails",
      },
    },
    {
      $unwind: { path: "$menuDetails", preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: "$foods.foodId",
        totalOrders: { $sum: 1 },
        name: { $first: "$foodDetails.name" },
        images: { $first: "$foodDetails.images" },
        category: { $first: { $ifNull: ["$menuDetails.name", "Unknown"] } },
      },
    },
    { $sort: { totalOrders: -1 } },
    { $limit: 3 },
  ]);

  return topThreeFoods;
};

const deliverymanOrderStats = async (userId: string) => {
  const delivery = await User.findOne({ clerkId: userId,role: "delivery man"});
  if (!delivery) {
    throw new AppError(404, "User not found");
  }
  const totalOrders = await Order.find({
    deliveryMan: delivery?._id,
  }).countDocuments();
  const runningOrders = await Order.find({
    deliveryMan: delivery?._id,
    isCompleted: false,
    isCancelled: false,
  }).countDocuments();
  const cancelledOrders = await Order.find({
    deliveryMan: delivery?._id,
    isCancelled: true,
  }).countDocuments();
  const completedOrders = await Order.find({
    deliveryMan: delivery?._id,
    isCompleted: true,
  }).countDocuments();

  const userStats = {
    totalOrders,
    runningOrders,
    cancelledOrders,
    completedOrders,
  };

  return userStats;
};

export const StatsServices = {
  getAllStats,
  getStatsForUser,
  topThreeFoods,
  deliverymanOrderStats,
};
