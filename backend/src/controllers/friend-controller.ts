import express from "express";
import { ChatModel } from "../db/models/chat";
import { UserModel } from "../db/models/user";

export const addFriend = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId, friendId }: { userId: string; friendId: string } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.friends.includes(friendId)) {
      return res
        .status(400)
        .json({ success: false, message: "This user is already your friend" });
    }

    user.friends.push(friendId);
    await user.save();

    const newChat = await ChatModel.create({ members: [userId, friendId] });

    return res.status(200).json({ friends: user.friends, chat: newChat });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const searchFriendByText = () => {};
