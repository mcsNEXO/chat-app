import React from "react";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { ChatType, OnlineUsersType, UserType } from "../../types/userTypes";
import { searchUsersByText } from "../../helpers/searchUserByText";

function UserChat({
  chat,
  activeChat,
  onlineUsers,
  searchChatTerm,
  handleActiveChat,
}: {
  chat: ChatType;
  activeChat: ChatType | null;
  onlineUsers: OnlineUsersType[];
  searchChatTerm: string;
  handleActiveChat: (
    chat: ChatType,
    recipient: UserType,
    activeChat: ChatType | null
  ) => void;
}) {
  const { recipientUser } = useFetchRecipient(chat);
  if (recipientUser && searchChatTerm) {
    const { success } = searchUsersByText(searchChatTerm, recipientUser);
    if (!success) return;
  }
  const data: any = [];
  return (
    <div
      className={`flex justify-between mt-1 gap-3 h-20 p-3 rounded-xl ${
        activeChat?._id === chat?._id ? "bg-active-gray" : "bg-dark-gray"
      }  `}
      onClick={() => {
        handleActiveChat(chat, recipientUser, activeChat);
      }}
    >
      <div
        className="h-full flex justify-center relative"
        style={{
          minWidth: activeChat?._id === chat?._id ? "70px" : "70px ",
        }}
      >
        <img
          src={`uploads/${recipientUser?.urlProfileImage}`}
          alt="friend"
          className={`h-full rounded-full w-14 ${
            activeChat?._id === chat?._id && "bg-black rounded-full"
          }`}
        />
        {onlineUsers?.some((x) => x?.userId === recipientUser?._id) && (
          <div className="pt-1 pl-1 mr-1 bg-dark-gray rounded-full absolute right-1 bottom-0">
            <div className="w-3 h-3 rounded-full bg-green-400 right-2 bottom-0 "></div>
          </div>
        )}
      </div>
      <div className="max-w-2/4 overflow-hidden ">
        <div className="font-bold block overflow-hidden">
          <div className="truncate">
            {recipientUser?.firstName} {recipientUser?.lastName}
          </div>
        </div>
        <div className="text-sm pt-1 truncate text-neutral-400">
          {data.lastMessage}
        </div>
      </div>
      <div className="w-1/6 h-full text-sm text-center flex flex-col justify-between items-center">
        <span className="max-w-full">{data.lastMessageDate}</span>
        {data.unReadMessageCount > 0 ? (
          <span className="bg-red-600 w-6 h-6 pb-0.5 rounded-full flex justify-center items-center">
            {data.unReadMessageCount}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default UserChat;
