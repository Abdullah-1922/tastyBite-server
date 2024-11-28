import { Types } from "mongoose";

export interface TUser {
  clerkId: string;
  email?: string;
  name: string;
  role: "authority" | "user"| "delivery man"|"manager"|"cashier";
  isDeleted: boolean;
  image?: string;
  phone?:string;
  location?:string[];
  paymentHistory: Types.ObjectId[]
  createdAt: Date;
  updatedAt:Date;
}
export interface TStripeUser {
  clerkId: string;
  customerId: string;
}
                