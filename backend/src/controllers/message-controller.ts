import express from "express";
import { MessageModel } from "../db/models/message";
import { ChatModel } from "../db/models/chat";
import fs from "fs";

export const createMessage = async (
  req: express.Request,
  res: express.Response
) => {
  const { chatId, senderId, text, replayMessageId } = req.body;
  const file = req.file;

  if (!chatId || !senderId || (!text && !file)) {
    return res.status(400).json("Problem");
  }
  const message = await MessageModel.create({
    chatId,
    senderId,
    text,
    image: file ? file.filename : null,
    repliedTo:
      replayMessageId && replayMessageId !== "null" ? replayMessageId : null,
  });
  try {
    await message.save();
    const populatedMessage = await message.populate({
      path: "repliedTo",
      model: "Message",
      select: {},
    });

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getMessage = async (
  req: express.Request,
  res: express.Response
) => {
  const { chatId, page, limit, term } = req.query as {
    chatId: string;
    page: string;
    limit: string;
    term: string | null;
  };

  const pageNumber = parseInt(page as string) || 1;
  const pageSize = parseInt(limit as string) || 10;
  const query = {
    chatId,
  };

  try {
    const messages = await MessageModel.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: "messages",
          localField: "repliedTo",
          foreignField: "_id",
          as: "repliedTo",
        },
      },
      {
        $unwind: {
          path: "$repliedTo",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return res.status(200).json({
      messages: messages.reverse(),
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getFirstMessage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { chatId } = req.params;
    const firstMessage = await MessageModel.findOne({ chatId }).sort({
      createdAt: 1,
    });
    if (!firstMessage) {
      try {
        const isChatExist = await ChatModel.findById(chatId);
        return res.status(200).json({
          success: true,
          date: null,
          message: "Chat do not have any messages",
        });
      } catch (error) {
        return res.status(500).json({ success: false, message: "error" });
      }
    }
    return res
      .status(200)
      .json({ success: true, date: firstMessage.createdAt });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const findMessages = async (
  req: express.Request,
  res: express.Response
) => {
  const { chatId, term } = req.query as {
    chatId: string;
    term: string;
  };
  try {
    const findedMessages = await MessageModel.find({
      chatId: chatId,
      text: term ?? "",
    });
    const findedMessagesLength = findedMessages.length;

    return res.status(200).json({
      findedMessages: findedMessages.reverse(),
      findedMessagesLength,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteMessage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { chatId, senderId, messageId } = req.params;
    const updatedMessage = await MessageModel.findOneAndUpdate(
      {
        senderId,
        chatId,
        _id: messageId,
      },
      { deleted: true, deletedAt: Date.now(), text: "Deleted message" },
      { new: true }
    );
    if (updatedMessage.image) {
      fs.unlink(
        `../frontend/public/message_images/${updatedMessage.image}`,
        async (err) => {
          if (err) throw err;
          updatedMessage.image = null;
          await updatedMessage.save();
        }
      );
    }
    return res.status(200).json(updatedMessage);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getMoreImages = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { chatId, limit } = req.params;
    const images = (
      await MessageModel.find({ chatId, image: { $ne: null } })
        .sort({ createdAt: -1 })
        .select({ image: 1, _id: 0 })
        .limit(Number(limit))
    ).map((obj) => `message_images/${obj.image}`);

    return res.status(200).json(images);
  } catch (error) {}
};
