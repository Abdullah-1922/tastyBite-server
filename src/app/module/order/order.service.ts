/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order, OrderCode } from "./order.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TOrder } from "./order.interface";
import { User } from "../User/user.model";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { orderStatus } from "./order.constant";
import { generateInvoiceId } from "../../utils/invoice-id-generator";
import { createNotification } from "../notification/notification.service";
import { INotification } from "../notification/notification.interface";

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
  return result;
};

const getOrderById = async (id: string) => {
  const result = await Order.findById(id).populate([
    { path: "foods.foodId", model: "Food" },
    { path: "user", model: "User" },
    { path: "deliveryMan", model: "User" },
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
      | "PickedUp"
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
  if (payload.status === "PickedUp") {
    object = {
      orderStatus: payload.status,
      isCompleted: true,
      isCancelled: false,
    };
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
        break;
      case "Out For Delivery":
        notificationPayload.name = "Out For Delivery";
        notificationPayload.description =
          "Your order is on the way! Get ready!";
        break;
      case "Delivered":
        notificationPayload.name = "Order Delivered";
        notificationPayload.description =
          "Enjoy your meal! Thank you for ordering.";
        break;
      case "Cancelled":
        notificationPayload.name = "Order Cancelled";
        notificationPayload.description =
          "We’re sorry your order was cancelled. Let us know if we can help.";
        break;
      default:
        notificationPayload.name = "Order Status Updated";
        notificationPayload.description = `Your order status has been updated to ${result.orderStatus}`;
        break;
    }
    await createNotification(notificationPayload);
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

    await createNotification(notificationPayloadForCode);

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
};
