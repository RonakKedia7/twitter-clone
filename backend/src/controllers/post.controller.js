import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary.js";

const populatePost = [
  {
    path: "user",
    select: "username firstName lastName profilePicture",
  },
  {
    path: "comments",
    populate: {
      path: "user",
      select: "username firstName lastName profilePicture",
    },
    options: {
      sort: { createdAt: -1 },
    },
  },
];

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate(populatePost)
    .select("-__v");

  return res.status(200).json({ posts });
});

export const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  const post = await Post.findById(postId)
    .populate(populatePost)
    .select("-__v");

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  return res.status(200).json({ post });
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({
    username: username.toLowerCase().trim(),
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate(populatePost)
    .select("-__v");

  return res.status(200).json({ posts });
});

export const createPost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const cleanedContent = content?.trim() || "";

  if (!cleanedContent && !imageFile) {
    return res.status(400).json({
      error: "Post must contain either text or image",
    });
  }

  if (cleanedContent.length > 280) {
    return res.status(400).json({
      error: "Post content cannot exceed 280 characters",
    });
  }

  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let imageUrl = "";

  if (imageFile) {
    try {
      const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
        "base64",
      )}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "social_media_posts",
        resource_type: "image",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      imageUrl = uploadResponse.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(400).json({ error: "Failed to upload image" });
    }
  }

  const post = await Post.create({
    user: user._id,
    content: cleanedContent,
    image: imageUrl,
  });

  const populatedPost = await Post.findById(post._id)
    .populate("user", "username firstName lastName profilePicture")
    .select("-__v");

  return res.status(201).json({
    post: populatedPost,
    message: "Post created successfully",
  });
});

export const likePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post) {
    return res.status(404).json({ error: "User or post not found" });
  }

  const isLiked = post.likes.some((id) => id.equals(user._id));

  if (isLiked) {
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user._id },
    });

    return res.status(200).json({
      message: "Post unliked successfully",
    });
  }

  await Post.findByIdAndUpdate(postId, {
    $addToSet: { likes: user._id },
  });

  if (!post.user.equals(user._id)) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "like",
      post: post._id,
    });
  }

  return res.status(200).json({
    message: "Post liked successfully",
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post) {
    return res.status(404).json({ error: "User or post not found" });
  }

  if (!post.user.equals(user._id)) {
    return res.status(403).json({
      error: "You can only delete your own posts",
    });
  }

  await Promise.all([
    Comment.deleteMany({ post: post._id }),
    Notification.deleteMany({ post: post._id }),
    Post.findByIdAndDelete(post._id),
  ]);

  return res.status(200).json({
    message: "Post deleted successfully",
  });
});
