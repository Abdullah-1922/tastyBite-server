import { Types } from "mongoose";

export interface INotification {
    user: Types.ObjectId; // Reference to the user
    name: string; // Notification title
    description: string; // Detailed description
    time: Date; // Time of the notification
    icon: string; // Emoji/icon for the notification
    color: string; // Color code for UI
    isRead?: boolean; // To track if the notification is read
    isArchived?: boolean; // To track if the notification is archived
  }