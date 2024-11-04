import { model, Schema } from "mongoose";
import { TFeedBack } from "./feedback.interface";

const feedbackSchema = new Schema<TFeedBack>({
    email: { type: String, required: true },
    feedback: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
}, { timestamps: true ,versionKey:false});

export const Feedback = model<TFeedBack>("Feedback", feedbackSchema);