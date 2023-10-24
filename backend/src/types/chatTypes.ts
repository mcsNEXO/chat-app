export type UserType = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  urlProfileImage: string;
};

export type OnlineUsersType = {
  userId: string;
  socketId: string;
};
export type MessageType = {
  _id: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  image: string | null;
  repliedMessage: MessageType[];
  repliedTo: MessageType | null;
  deleted: boolean;
  deletedAt: Date | null;
};
