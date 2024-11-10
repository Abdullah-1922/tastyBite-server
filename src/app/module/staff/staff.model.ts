import { model, Schema } from "mongoose";
import { TStaff } from "./staff.interface";

const staffSchema = new Schema<TStaff>(
  {
    email: { type: String, required: false },
    image: { type: String, required: true },
    name: { type: String, required: true },
    phoneNo: { type: String, required: true },
    designation: { type: String, required: true },
    address: { type: String, required: true },

    facebookLink: { type: String, required: false },
    bio: { type: String, required: false },
    linkedinLink: { type: String, required: false },
    instagramLink: { type: String, required: false },
    youtubeLink: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);

export const Staff = model<TStaff>("Staff", staffSchema);
