import express from "express";
import {
  addNotification,
  countTotalUnreadNotification,
  deleteUserNotification,
  getUserNotifications,
  markAsRead,
  markToggleNotificationArchived,
} from "./notification.controller";

const router = express.Router();

// Create a notification
router.post("/", addNotification);

// Get notifications for a user
router.get("/:userId", getUserNotifications);

// Mark a notification as read
router.patch("/archive/:id", markToggleNotificationArchived);
router.get("/unread/:id", countTotalUnreadNotification);
router.patch("/:id", markAsRead);
router.delete("/:userId", deleteUserNotification);

export const NotificationRoutes = router;
