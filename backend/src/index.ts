import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { PORT, DATABASE } from "../config";
import mongoose from "mongoose";
import router from "./router/router";
import { WebSocket } from "ws";
import { Server } from "socket.io";
import { OnlineUsersType } from "types/chatTypes";

declare class MyWebSocket extends WebSocket {
  userId: string;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(compression());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

server.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));

let onlineUsers: OnlineUsersType[] = [];
io.on("connection", (socket) => {
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId !== message.senderId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  socket.on("deleteMessage", async (messageInfo) => {
    const user = onlineUsers.find((x) => x.userId === messageInfo.toUserId);
    if (user) {
      io.to(user.socketId).emit("getDeleteMessage", messageInfo.deletedMessage);
    }
  });

  socket.on("deleteChat", async (chatInfo) => {
    const user = onlineUsers.find((x) => x.userId === chatInfo.toUserId);
    if (user) {
      io.to(user.socketId).emit("getDeletedChat", chatInfo);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});
mongoose.Promise = Promise;
mongoose.connect(DATABASE);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
