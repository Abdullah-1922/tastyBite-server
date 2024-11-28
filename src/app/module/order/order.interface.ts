import { Types } from "mongoose";

export type TOrder = {
  _id?: Types.ObjectId;
  clerkId?: string;
  user: Types.ObjectId;
  foods: { foodId: Types.ObjectId; quantity: number }[];
  paymentStatus: "Paid" | "Refunded";
  transactionId?: string;
  invoiceId?: string;
  isCancelled: boolean;
  isCompleted: boolean;
  deliveryMan?: Types.ObjectId;
  orderStatus:
    | "Order Placed"
    | "Order Confirmed"
    | "Cooking"
    | "Out For Delivery"
    | "Delivered"
    | "PickedUp"
    | "Cancelled";
  deliveryLocation: string;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
};
