import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { clerkClient, getAuth } from "@clerk/express";

const allowedProfileUpdates = [
  "firstName",
  "lastName",
  "username",
  "profilePicture",
  "bannerImage",
  "bio",
  "location",
];

const getSafeUpdates = (body) => {
  const updates = {};

  for (const key of allowedProfileUpdates) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }

  return updates;
};

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username: username.toLowerCase().trim() })
    .select("-__v")
    .populate("followers", "username firstName lastName profilePicture")
    .populate("following", "username firstName lastName profilePicture");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const updates = getSafeUpdates(req.body);

  if (updates.username) {
    updates.username = updates.username.toLowerCase().trim();

    const usernameExists = await User.findOne({
      username: updates.username,
      clerkId: { $ne: userId },
    });

    if (usernameExists) {
      return res.status(400).json({ error: "Username already taken" });
    }
  }

  const user = await User.findOneAndUpdate(
    { clerkId: userId },
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  ).select("-__v");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({
    user,
    message: "Profile updated successfully",
  });
});

export const syncUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const existingUser = await User.findOne({ clerkId: userId });

  if (existingUser) {
    return res.status(200).json({
      user: existingUser,
      message: "User already exists",
    });
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return res.status(400).json({ error: "Email not found from Clerk" });
  }

  const baseUsername = email.split("@")[0].toLowerCase();

  let username = baseUsername;
  let count = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${count}`;
    count++;
  }

  const user = await User.create({
    clerkId: userId,
    email,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    username,
    profilePicture: clerkUser.imageUrl || "",
  });

  return res.status(201).json({
    user,
    message: "User created successfully",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await User.findOne({ clerkId: userId }).select("-__v");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ user });
});

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetUserId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return res.status(400).json({ error: "Invalid target user ID" });
  }

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    return res.status(404).json({ error: "User not found" });
  }

  if (currentUser._id.equals(targetUser._id)) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  const isFollowing = currentUser.following.some((id) =>
    id.equals(targetUser._id),
  );

  if (isFollowing) {
    await Promise.all([
      User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: targetUser._id },
      }),
      User.findByIdAndUpdate(targetUser._id, {
        $pull: { followers: currentUser._id },
      }),
    ]);

    return res.status(200).json({
      message: "User unfollowed successfully",
    });
  }

  await Promise.all([
    User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { following: targetUser._id },
    }),
    User.findByIdAndUpdate(targetUser._id, {
      $addToSet: { followers: currentUser._id },
    }),
    Notification.create({
      from: currentUser._id,
      to: targetUser._id,
      type: "follow",
    }),
  ]);

  return res.status(200).json({
    message: "User followed successfully",
  });
});
