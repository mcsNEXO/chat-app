import express from "express";
import { ChatModel } from "../db/models/chat";
import { MessageModel } from "../db/models/message";
import fs from "fs";

export const createChat = async (
  req: express.Request,
  res: express.Response
) => {
  const { firstId, secondId } = req.body;
  if (!firstId || !secondId)
    return res
      .status(400)
      .json({ success: false, message: "You need 2 person to create a chat." });
  try {
    const existChat = await ChatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (existChat) return res.status(200).json(existChat);
    const newChat = await ChatModel.create({
      members: [firstId, secondId],
    });
    await newChat.save();
    return res.status(200).json(newChat);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const findUserChats = async (
  req: express.Request,
  res: express.Response
) => {
  const userId = req.params.userId;
  try {
    const userChats = await ChatModel.find({
      members: userId,
    });
    return res.status(200).json(userChats);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const findChat = async (req: express.Request, res: express.Response) => {
  const { firstId, secondId } = req.params;
  try {
    const userChats = await ChatModel.find({
      members: { $all: [firstId, secondId] },
    });
    return res.status(200).json(userChats);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteChat = async (
  req: express.Request,
  res: express.Response
) => {
  const { chatId } = req.params;
  try {
    const deletedChat = await ChatModel.findOneAndDelete({ _id: chatId });
    (await MessageModel.find({ chatId })).forEach((x) => {
      if (x.image) {
        fs.unlink(`../frontend/public/message_images/${x.image}`, (err) => {});
      }
      x.deleteOne();
    });
    return res.status(200).json(deletedChat);
  } catch (error) {
    return res.status(500).json(error);
  }
};
