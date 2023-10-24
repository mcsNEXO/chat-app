import express from "express";
const router = express.Router();
import {
  login,
  register,
  updateAccessToken,
  logout,
  findUserById,
  getUsersByText,
  updateUserImage,
  deleteUserImage,
  editPassword,
  editEmail,
} from "../controllers/user-controller";
import { isAuthenticated } from "../middlewares/authentication";
import {
  createChat,
  findChat,
  findUserChats,
  deleteChat,
} from "../controllers/chat-controller";
import multer from "multer";
import {
  createMessage,
  deleteMessage,
  findMessages,
  getFirstMessage,
  getMessage,
  getMoreImages,
} from "../controllers/message-controller";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/uploads");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + path.extname(file.originalname);
    cb(null, name);
  },
});

const storageMessage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/message_images");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + path.extname(file.originalname);
    cb(null, name);
  },
});

const upload = multer({ storage: storage }).single("image");
const uploadMessage = multer({ storage: storageMessage }).single("image");

//authentication
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/logout", logout);
router.get("/auth/token", updateAccessToken);

//users
router.get("/users/findUserById/:userId", isAuthenticated, findUserById);
router.get("/users/findUsersByText/:text", isAuthenticated, getUsersByText);
router.put("/users/updateImage", isAuthenticated, upload, updateUserImage);
router.put("/users/deleteImage/:userId", isAuthenticated, deleteUserImage);
router.put("/users/editPassword", isAuthenticated, editPassword);
router.put("/users/editEmail", isAuthenticated, editEmail);

//chats
router.post("/chat/createChat", isAuthenticated, createChat);
router.get("/chat/findChats/:userId", isAuthenticated, findUserChats);
router.get("/chat/findChat/:firstId/:secondId", isAuthenticated, findChat);
router.get("/chat/delete/:chatId", isAuthenticated, deleteChat);

//messages
router.post(
  "/message/createMessage",
  isAuthenticated,
  uploadMessage,
  createMessage
);
router.get("/message/getMessage", isAuthenticated, getMessage);
router.get("/message/findMessages", isAuthenticated, findMessages);
router.get(
  "/message/getFirstMessage/:chatId",
  isAuthenticated,
  getFirstMessage
);
router.get(
  "/message/delete/:chatId/:senderId/:messageId",
  isAuthenticated,
  deleteMessage
);
router.get(
  "/message/getMoreImages/:chatId/:limit",
  isAuthenticated,
  getMoreImages
);

export default (): express.Router => {
  return router;
};
