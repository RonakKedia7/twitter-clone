import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { getAuth } from "@clerk/express";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .select("-__v");

  return res.status(200).json({ comments });
});

export const createComment = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const { content } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  const cleanedContent = content?.trim();

  if (!cleanedContent) {
    return res.status(400).json({ error: "Comment content is required" });
  }

  if (cleanedContent.length > 280) {
    return res.status(400).json({
      error: "Comment cannot exceed 280 characters",
    });
  }

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post) {
    return res.status(404).json({ error: "User or post not found" });
  }

  const comment = await Comment.create({
    user: user._id,
    post: post._id,
    content: cleanedContent,
  });

  await Post.findByIdAndUpdate(post._id, {
    $addToSet: { comments: comment._id },
  });

  if (!post.user.equals(user._id)) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "comment",
      post: post._id,
      comment: comment._id,
    });
  }

  const populatedComment = await Comment.findById(comment._id)
    .populate("user", "username firstName lastName profilePicture")
    .select("-__v");

  return res.status(201).json({
    comment: populatedComment,
    message: "Comment created successfully",
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { commentId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }

  const user = await User.findOne({ clerkId: userId });
  const comment = await Comment.findById(commentId);

  if (!user || !comment) {
    return res.status(404).json({ error: "User or comment not found" });
  }

  if (!comment.user.equals(user._id)) {
    return res.status(403).json({
      error: "You can only delete your own comments",
    });
  }

  await Promise.all([
    Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    }),
    Notification.deleteMany({ comment: comment._id }),
    Comment.findByIdAndDelete(comment._id),
  ]);

  return res.status(200).json({
    message: "Comment deleted successfully",
  });
});
