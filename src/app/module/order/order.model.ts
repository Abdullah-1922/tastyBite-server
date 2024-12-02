// src/models/Order.ts
import mongoose, { Schema } from "mongoose";
import { TOrder } from "./order.interface";
import { orderStatus } from "./order.constant";

const OrderSchema = new Schema<TOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    foods: [
      {
        foodId: { type: Schema.Types.ObjectId, ref: "Food" },
        quantity: { type: Number },
      },
    ],
    paymentStatus: { type: String, enum: ["Paid", "Refunded"], required: true },
    transactionId: { type: String },
    invoiceId: { type: String },
    isCancelled: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    deliveryMan: { type: Schema.Types.ObjectId, ref: "User" },
    orderStatus: {
      type: String,
      enum: orderStatus,
      default: "Order Placed",
    },
    deliveryLocation: { type: String, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const  orderCodeSchema = new Schema(
  {
    orderCode: { type: String, required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deliveryMan: { type: Schema.Types.ObjectId, ref: "User",required: true },
  },
  { timestamps: true }
);
export const OrderCode = mongoose.model("OrderCode", orderCodeSchema);




export const Order = mongoose.model<TOrder>("Order", OrderSchema);
