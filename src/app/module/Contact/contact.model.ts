import { Schema, model } from "mongoose";
import { TContact } from "./contact.interface";

const ContactSchema = new Schema<TContact>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true } 
);

export const Contact = model<TContact>("Contact", ContactSchema);
