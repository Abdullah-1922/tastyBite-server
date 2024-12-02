import { Schema, model } from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    name: { type: String, required: true }, // Notification title
    description: { type: String, required: true }, // Notification description
    time: { type: Date, default: Date.now }, // Time of the event
    icon: { type: String, required: true }, // Icon for the event
    color: { type: String, required: true }, // UI color for the event
    isRead: { type: Boolean, default: false }, // Read status
    isArchived: { type: Boolean, default: false }, // Archived status
  },
  { timestamps: true }
);

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
