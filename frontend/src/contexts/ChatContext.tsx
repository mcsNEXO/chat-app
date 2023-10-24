import React from "react";
import { useAuth } from "./AuthContext";
import { apiClient } from "../axios";
import {
  ChatType,
  MessageType,
  OnlineUsersType,
  UserType,
} from "../types/userTypes";
import { Socket, io } from "socket.io-client";

interface IChatContext {
  userChats: ChatType[];
  chatsLoading: boolean;
  messages: MessageType[];
  messagesLoading: boolean;
  activeChat: ChatType | null;
  recipient: UserType | null;
  newMessage: MessageType;
  onlineUsers: OnlineUsersType[];
  page: number;
  firstMessageDate: string;
  deleteMessage: (messageId: string, recipientId: string) => Promise<void>;
  handleActiveChat: (
    chat: ChatType,
    recipient: UserType,
    activeChat: ChatType | null
  ) => void;
  addFriend: (secondId: string) => Promise<void>;
  handlePage: () => void;
  deleteChat: () => Promise<void>;
  sendMessage: (
    textMessage: string,
    senderId: string,
    activeChatId: string,
    repleyMessageId: MessageType | null,
    image: File | null
  ) => Promise<{ success: boolean }>;
}

export const ChatContext = React.createContext<IChatContext>(null as any);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { auth } = useAuth();
  const [socket, setSocket] = React.useState<Socket>();
  const [userChats, setUserChats] = React.useState<ChatType[]>([]);
  const [chatsLoading, setChatsLoading] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const [messagesLoading, setMessageLoading] = React.useState<boolean>(false);
  const [activeChat, setActiveChat] = React.useState<ChatType | null>(null);
  const [recipient, setRecipient] = React.useState<UserType | null>(null);
  const [newMessage, setNewMessage] = React.useState<MessageType>(
    {} as MessageType
  );
  const [deletedChat, setDeletedChat] = React.useState<ChatType>(
    {} as ChatType
  );
  const [deletedMessage, setDeletedMessage] = React.useState<MessageType>(
    {} as MessageType
  );
  const [onlineUsers, setOnlineUsers] = React.useState<OnlineUsersType[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [firstMessageDate, setFirstMessageDate] = React.useState<string>("");
  const [notifications, setNotifications] = React.useState<any[]>([]);

  React.useEffect(() => {
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [auth]);

  React.useEffect(() => {
    if (!socket) return;
    socket.emit("addNewUser", auth?._id);

    socket.on("getOnlineUsers", (res: OnlineUsersType[]) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  React.useEffect(() => {
    if (!socket) return;
    socket.emit("sendMessage", newMessage);
  }, [newMessage]);

  React.useEffect(() => {
    if (!socket) return;
    socket.emit("deleteMessage", { deletedMessage, toUserId: recipient?._id });
  }, [deletedMessage]);

  React.useEffect(() => {
    if (!socket) return;
    socket.emit("deleteChat", { deletedChat, toUserId: recipient?._id });
  }, [deletedChat]);

  React.useEffect(() => {
    if (!socket) return;
    socket.on("getMessage", (res) => {
      if (activeChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {});

    socket.on("getDeleteMessage", (res) => {
      setMessages((prev) => prev.map((x) => (x._id === res._id ? res : x)));
    });

    socket.on("getDeletedChat", (res) => {
      console.log(res.deletedChat._id);
      setUserChats((prev) => prev.filter((x) => x._id !== res.deletedChat._id));
      setActiveChat(null);
    });

    return () => {
      socket.off("getMessage");
      socket.off("getDeleteMessage");
      socket.off("getDeleteChat");
    };
  }, [socket, activeChat]);

  React.useEffect(() => {
    const getUserChats = async () => {
      try {
        setChatsLoading(true);
        if (auth?._id) {
          const res = await apiClient.sendRequest({
            method: "get",
            url: `chat/findChats/${auth?._id}`,
          });
          const chats = res.data as ChatType[];
          setUserChats(chats);
        }
      } catch (error: any) {
        throw new Error(`chatContext ${error}`);
      } finally {
        setChatsLoading(false);
      }
    };
    getUserChats();
  }, [auth]);

  React.useEffect(() => {
    if (!activeChat?._id) return;
    const getMessages = async () => {
      try {
        setMessageLoading(true);
        const res = await apiClient.sendRequest({
          method: "get",
          url: `message/getMessage?chatId=${activeChat?._id}&page=${page}`,
        });
        const data = res.data as any;
        const message = data.messages as MessageType[];
        setMessages((prev) => [...message, ...prev]);
      } catch (error: any) {
        throw new Error(`chatContext ${error}`);
      } finally {
        setMessageLoading(false);
      }
    };
    getMessages();
  }, [activeChat, page]);

  const sendMessage = React.useCallback(
    async (
      textMessage: string,
      senderId: string,
      activeChatId: string,
      replayMessage: MessageType | null,
      image: File | null
    ) => {
      if (!textMessage && !image) return { success: false };
      const formData = new FormData();
      formData.append("text", textMessage);
      formData.append("senderId", senderId);
      formData.append("chatId", activeChatId);
      formData.append(
        "replayMessageId",
        replayMessage ? replayMessage._id : "null"
      );
      formData.append("image", image ? image : "null");
      try {
        const res = await apiClient.sendRequest({
          method: "post",
          url: `message/createMessage`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const responseMessage = res.data as MessageType;
        setNewMessage(responseMessage);
        setMessages((prev) => [...prev, responseMessage]);
        return { success: true };
      } catch (error) {
        throw new Error(error as any);
      }
    },
    []
  );

  const addFriend = async (secondId: string) => {
    try {
      const res = await apiClient.sendRequest({
        method: "post",
        url: "chat/createChat",
        data: {
          firstId: auth?._id,
          secondId,
        },
      });
      const objectData = res.data as ChatType;
      setUserChats((prev) => [...prev, objectData]);
    } catch (error) {
      throw new Error(error as any);
    }
  };

  const handleActiveChat = React.useCallback(
    (chat: ChatType, recipient: UserType, activeChat: ChatType | null) => {
      if (chat._id === activeChat?._id) return;
      getFirstMessageDate(chat._id);
      setMessages([]);
      setPage(1);
      setRecipient(recipient);
      setActiveChat(chat);
    },
    []
  );

  const handlePage = React.useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const getFirstMessageDate = async (chatId: string) => {
    try {
      const res = await apiClient.sendRequest({
        method: "get",
        url: `message/getFirstMessage/${chatId}`,
      });
      const firstMessDate = res.data as {
        success: boolean;
        date: null | string;
        message?: string;
      };
      if (firstMessDate.date === null) return;
      if (firstMessDate) setFirstMessageDate(firstMessDate.date);
    } catch (error) {
      throw new Error(error as any);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const res = await apiClient.sendRequest({
        method: "get",
        url: `message/delete/${activeChat?._id}/${auth?._id}/${messageId}`,
      });
      const message = res.data as MessageType;
      setDeletedMessage(message);
      setMessages((prev) =>
        prev.map((x) => (x._id === message._id ? message : x))
      );
    } catch (error) {}
  };

  const deleteChat = async () => {
    const answear = confirm("Are you sure you want to delete chat?");
    if (!answear) return;
    setActiveChat(null);
    setUserChats((prev) => prev.filter((x) => activeChat?._id !== x._id));
    try {
      const res = await apiClient.sendRequest({
        method: "get",
        url: `chat/delete/${activeChat?._id}`,
      });
      const data = res.data as ChatType;
      setDeletedChat(data);
    } catch (error) {}
  };

  const value = {
    userChats,
    chatsLoading,
    messages,
    messagesLoading,
    activeChat,
    recipient,
    newMessage,
    onlineUsers,
    page,
    firstMessageDate,
    sendMessage,
    addFriend,
    deleteChat,
    deleteMessage,
    handleActiveChat,
    handlePage,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatList = () => React.useContext(ChatContext);
