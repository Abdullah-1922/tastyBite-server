import { model, Schema } from "mongoose";
import { TFood } from "./food.interface";

const foodSchema: Schema = new Schema<TFood>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true },
    menuId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
    sizes: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
      },
    ],
    extras: [
      {
        name: { type: String, required: true },
        extra_price: { type: Number, required: true },
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    rating: [{ type: Schema.Types.ObjectId, ref: "User" }],
    averageRating: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Food = model<TFood>("Food", foodSchema);
