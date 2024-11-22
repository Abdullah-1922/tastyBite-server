import { Schema, model } from "mongoose";
import { TFoodFeedback } from "./foodFeedback.interface";

const foodFeedbackSchema = new Schema<TFoodFeedback>(
  {
    foodId: { type: String, required: true },
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const FoodFeedback = model<TFoodFeedback>("FoodFeedback", foodFeedbackSchema);

export default FoodFeedback;
