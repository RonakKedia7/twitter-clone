import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await User.findOne({ clerkId: userId }).select("_id");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const notifications = await Notification.find({ to: user._id })
    .sort({ createdAt: -1 })
    .populate("from", "username firstName lastName profilePicture")
    .populate("post", "content image")
    .populate("comment", "content")
    .select("-__v");

  return res.status(200).json({ notifications });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { notificationId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return res.status(400).json({ error: "Invalid notification ID" });
  }

  const user = await User.findOne({ clerkId: userId }).select("_id");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    to: user._id,
  });

  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }

  return res.status(200).json({
    message: "Notification deleted successfully",
  });
});
