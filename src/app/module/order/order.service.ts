/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { generateInvoiceId } from "../../utils/invoice-id-generator";
import { pusherServer } from "../../utils/pusher";
import { Food } from "../Food/food.model";
import { INotification } from "../notification/notification.interface";
import { createNotification } from "../notification/notification.service";
import { User } from "../User/user.model";
import { orderStatus } from "./order.constant";
import { TOrder } from "./order.interface";
import { Order, OrderCode } from "./order.model";

const createOrder = async (orderPayload: Partial<TOrder>) => {
  if (!orderPayload.clerkId) {
    throw new AppError(httpStatus.BAD_REQUEST, "clerkId is required");
  }
  orderPayload.invoiceId = generateInvoiceId();

  const user = await User.findOne({ clerkId: orderPayload.clerkId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (orderPayload.deliveryMan === user._id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't assign yourself as delivery "
    );
  }
  if (user) {
    orderPayload.user = user._id;
  }

  const result = await Order.create(orderPayload);

  if (result && orderPayload.foods) {
    await Promise.all(
      orderPayload.foods.map(async (food) => {
        await Food.findByIdAndUpdate(food.foodId, {
          $push: { orders: result._id },
        });
      })
    );
  }

  return result;
};

const getOrderById = async (id: string) => {
  const result = await Order.findById(id).populate([
    { path: "foods.foodId", model: "Food" },
    { path: "user", model: "User" },
    { path: "deliveryMan", model: "User" },
    { path: "deliveryLocation", model: "DeliveryLocation" },
  ]);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return result;
};

const getAllOrders = async (query: Record<string, unknown>) => {
  if (query.isCancelled) {
    query.isCancelled = query.isCancelled === "true" ? true : false;
  }

  if (query.isCompleted) {
    query.isCompleted = query.isCompleted === "true" ? true : false;
  }
  console.log(query);
  const orderQuery = new QueryBuilder(
    Order.find().populate([
      { path: "foods.foodId", model: "Food" },
      { path: "user", model: "User" },
      { path: "deliveryMan", model: "User" },
      { path: "deliveryLocation", model: "DeliveryLocation" },
    ]),
    query
  )
    .search(["invoiceId", "orderStatus"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();
  return { result, meta };
};

const updateOrder = async (id: string, updatePayload: Partial<TOrder>) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  const result = await Order.findByIdAndUpdate(id, updatePayload, {
    new: true,
  });
  return result;
};

const deleteOrder = async (id: string) => {
  const result = await Order.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return result;
};
const updateOrderStatus = async (
  id: string,
  payload: {
    status:
      | "Order Placed"
      | "Order Confirmed"
      | "Cooking"
      | "Out For Delivery"
      | "Delivered"
      | "Cancelled";
    deliveryMan?: string;
  }
) => {
  if (!orderStatus.includes(payload.status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid order status");
  }

  if (!payload.status) {
    throw new AppError(httpStatus.BAD_REQUEST, "status is required");
  }
  if (payload.status === "Out For Delivery" && !payload.deliveryMan) {
    throw new AppError(httpStatus.BAD_REQUEST, "delivery man is required");
  }
  const order = await Order.findById(id);

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  if (order.orderStatus === payload.status) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order already in this status");
  }
  if (order.isCancelled) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order is already cancelled");
  }
  if (order.orderStatus === "Delivered" || order.orderStatus === "Cancelled") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Order already delivered or cancelled"
    );
  }
  if (payload.status === "Cancelled") {
    const result = await Order.findByIdAndUpdate(
      id,
      { orderStatus: payload.status, isCancelled: true },
      { new: true }
    );
  }

  if (payload.status === "Out For Delivery") {
    const user = await User.findById(payload.deliveryMan);

    if (!user || user.role !== "delivery man") {
      throw new AppError(httpStatus.NOT_FOUND, "Delivery man not found");
    }
  }

  let object = {};
  if (payload.deliveryMan) {
    object = { orderStatus: payload.status, deliveryMan: payload.deliveryMan };
  } else {
    object = { orderStatus: payload.status };
  }

  const result = await Order.findByIdAndUpdate(id, object, { new: true });
  if (result) {
    const notificationPayload: INotification = {
      name: "",
      description: "",
      user: result?.user,
      color: "#FFE0B5",
      icon: "🍕",
      time: new Date(),
    };

    switch (result.orderStatus) {
      case "Order Placed":
        notificationPayload.name = "Order Placed";
        notificationPayload.description =
          "Thank you for your order! We’re getting it ready.";

        break;
      case "Order Confirmed":
        notificationPayload.name = "Order Confirmed";
        notificationPayload.description =
          "Your order has been confirmed. Stay tuned!";

        break;
      case "Cooking":
        notificationPayload.name = "Cooking in Progress";
        notificationPayload.description =
          "Your delicious meal is being prepared.";
        notificationPayload.icon = "🍳";
        break;
      case "Out For Delivery":
        notificationPayload.name = "Out For Delivery";
        notificationPayload.description =
          "Your order is on the way! Get ready!";
        notificationPayload.icon = "🚚";
        break;
      case "Cancelled":
        notificationPayload.name = "Order Cancelled";
        notificationPayload.description =
          "We’re sorry your order was cancelled. Let us know if we can help.";
        notificationPayload.color = "#FF3D71";
        notificationPayload.icon = "❌";
        break;
      default:
        notificationPayload.name = "Order Status Updated";
        notificationPayload.description = `Your order status has been updated to ${result.orderStatus}`;
        break;
    }
    const notificationResult = await createNotification(notificationPayload);

    try {
      const user = await User.findById(order?.user);

      if (user?.clerkId) {
        await pusherServer.trigger(
          user.clerkId,
          "notification:new",
          notificationResult
        );
      }
    } catch (error) {
      console.log("Failed to send notification:", error);
    }
  }

  if (result?.orderStatus === "Out For Delivery") {
    const generateDeliveryCode = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const deliveryCode = generateDeliveryCode();

    const notificationPayloadForCode: INotification = {
      name: "Delivery Code",
      description: `Your delivery code is ${deliveryCode}`,
      user: result?.user,
      color: "#FF3D71",
      icon: "🔑",
      time: new Date(),
    };

    const notificationResult = await createNotification(
      notificationPayloadForCode
    );

    try {
      const user = await User.findById(order?.user);

      if (user?.clerkId) {
        await pusherServer.trigger(
          user.clerkId,
          "notification:new",
          notificationResult
        );
      }
    } catch (error) {
      console.log("Failed to send notification:", error);
    }

    const orderCode = {
      orderCode: deliveryCode,
      order: result._id,
      user: result.user,
      deliveryMan: result.deliveryMan,
    };
    await OrderCode.create(orderCode);
  }

  return result;
};

const CompleteOrder = async (payload: any) => {
  if (!payload.orderId || !payload.deliveryCode) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "orderId and deliveryCode is required"
    );
  }

  const order = await Order.findById(payload.orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  if (order.isCompleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order already completed");
  }
  const orderCode = await OrderCode.findOne({ order: order._id });
  if (!orderCode) {
    throw new AppError(httpStatus.BAD_REQUEST, "Delivery code not found");
  }
  if (orderCode.orderCode !== payload.deliveryCode) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid delivery code");
  }
  const result = await Order.findByIdAndUpdate(
    order._id,
    { isCompleted: true, orderStatus: "Delivered" },
    { new: true }
  );

  const notificationPayload: INotification = {
    name: "Order Delivered",
    description:
      "Your order has been successfully delivered. We hope you enjoy your meal! Thank you for choosing TastyBite!",
    user: order?.user,
    color: "#A8CD89",
    icon: "🎉",
    time: new Date(),
  };

  const notificationResult = await createNotification(notificationPayload);

  try {
    const user = await User.findById(order?.user);

    if (user?.clerkId) {
      await pusherServer.trigger(
        user.clerkId,
        "notification:new",
        notificationResult
      );
    }
  } catch (error) {
    console.log("Failed to send notification:", error);
  }

  await OrderCode.findByIdAndDelete(orderCode._id);

  return result;
};

const getUserOrders = async (userId: string, query: any) => {
  if (query.isCancelled) {
    query.isCancelled = query.isCancelled === "true" ? true : false;
  }

  if (query.isCompleted) {
    query.isCompleted = query.isCompleted === "true" ? true : false;
  }
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const orderQuery = new QueryBuilder(
    Order.find({ user: user._id }).populate([
      { path: "foods.foodId", model: "Food" },
      { path: "user", model: "User" },
      { path: "deliveryMan", model: "User" },
      { path: "deliveryLocation", model: "DeliveryLocation" },
    ]),
    query
  )
    .search(["invoiceId", "orderStatus"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();

  return { result, meta };
};
const getDeliveryManOrders = async (deliveryManId: string, query: any) => {
  if (query.isCancelled) {
    query.isCancelled = query.isCancelled === "true" ? true : false;
  }

  if (query.isCompleted) {
    query.isCompleted = query.isCompleted === "true" ? true : false;
  }
  const user = await User.findOne({ clerkId: deliveryManId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const orderQuery = new QueryBuilder(
    Order.find({ deliveryMan: user._id }).populate([
      { path: "foods.foodId", model: "Food" },
      { path: "user", model: "User" },
      { path: "deliveryMan", model: "User" },
      { path: "deliveryLocation", model: "DeliveryLocation" },
    ]),
    query
  )
    .search(["invoiceId", "orderStatus"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();

  return { result, meta };
};

export const OrderServices = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getUserOrders,
  getDeliveryManOrders,
  CompleteOrder,
};
