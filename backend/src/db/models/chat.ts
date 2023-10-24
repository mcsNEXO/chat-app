import mongoose from "mongoose";
interface IChat extends mongoose.Document {
  members: [{ userId: string; nickName: string }];
}

const member = new mongoose.Schema({
  userId: { type: String },
  nickName: { type: String },
});

const chatSchema: mongoose.Schema<IChat> = new mongoose.Schema(
  {
    members: {
      type: [String],
    },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model("Chat", chatSchema);
