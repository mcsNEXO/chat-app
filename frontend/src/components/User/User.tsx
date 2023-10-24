import React from "react";
import { ChatType, UserType } from "../../types/userTypes";
import {
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";

interface IUser {
  user: UserType;
  chats: ChatType[];
  activeChat: ChatType | null;
  addFriend: (secondId: string) => Promise<void>;
  handleActiveChat: (
    chat: ChatType,
    recipient: UserType,
    activeChat: ChatType | null
  ) => void;
}

function User({ user, chats, addFriend, handleActiveChat, activeChat }: IUser) {
  const isChatExist = chats.find((x) => x.members.includes(user._id));
  return (
    <div
      className="w-full h-16 mt-1 flex p-2 justify-between items-center bg-dark-gray rounded-lg overflow-hidden"
      onClick={() =>
        isChatExist && handleActiveChat(isChatExist, user, activeChat)
      }
    >
      <div className="h-full w-16">
        <img
          src={`uploads/${user.urlProfileImage}`}
          alt="user-img"
          className="h-full rounded-full w-12"
        />
      </div>
      <div className="text-center overflow-hidden truncate break-normal">{`${user.firstName} ${user.lastName}`}</div>

      {isChatExist ? (
        <button className="text-center flex items-center text-2xl">
          <TeamOutlined className="text-green-700" />
        </button>
      ) : (
        <button
          className="text-center flex items-center text-2xl"
          onClick={() => addFriend(user._id)}
        >
          <UserAddOutlined className="text-blue-700 text-opacity-80" />
        </button>
      )}
    </div>
  );
}

export default User;
