import { model, Schema } from "mongoose";
import { TStaff } from "./staff.interface";

const staffSchema = new Schema<TStaff>(
  {
    email: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    phoneNo: { type: String, required: true },
    designation: { type: String, required: true },
    address: { type: String, required: true },
    socialLink: [
      {
        provider: {
          type: String,
          enum: ["facebook", "twitter", "linkedin", "instagram"],
          required: true,
        },
        link: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export const Staff = model<TStaff>("Staff", staffSchema);
