import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
    },
    text: { type: String },
    chatId: { type: String },
    image: { type: String || null },
    repliedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model("Message", messageSchema);
