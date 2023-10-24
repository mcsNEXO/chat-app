import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UserAddOutlined } from "@ant-design/icons";
import SearchInput from "../../components/SearchInput/SearchInput";
import Messages from "../../components/Messages/Messages";
import UserChat from "../../components/UserChat/UserChat";
import { useChatList } from "../../contexts/ChatContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { ChatType, UserType } from "../../types/userTypes";
import { apiClient } from "../../axios";
import { useDebounce } from "use-debounce";
import User from "../../components/User/User";
import {
  IoMdPersonAdd,
  IoMdPeople,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import DrawerComponent from "../../components/Drawer/Drawer";
import "react-image-crop/src/ReactCrop.scss";
import ReactCrop, { Crop } from "react-image-crop";
import pickChat from "../../assets/pick_chat.svg";

export const ChatPage = () => {
  //states
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [isActiveDrawer, setIsActiveDrawer] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedValue] = useDebounce(searchTerm, 500);
  const [loadingUsers, setLoadingUsers] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [searchChatTerm, setSearchChatTerm] = React.useState<string>("");

  //context
  const scroll: React.MutableRefObject<any> = React.useRef();
  const {
    userChats,
    chatsLoading,
    messages,
    messagesLoading,
    activeChat,
    recipient,
    onlineUsers,
    page,
    firstMessageDate,
    handleActiveChat,
    deleteMessage,
    addFriend,
    deleteChat,
    sendMessage,
    handlePage,
  } = useChatList();

  React.useEffect(() => {
    if (debouncedValue === "") return setUsers([]);
    searchUserByText(debouncedValue);
  }, [debouncedValue]);

  const searchUserByText = async (text: string) => {
    try {
      setLoadingUsers(true);
      const res = await apiClient.sendRequest({
        method: "get",
        url: `users/findUsersByText/${text}`,
      });
      const responseUsers = res.data as UserType[];
      setUsers(responseUsers);
    } catch (error) {
      throw new Error(error as any);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleInputChange = (text: string) => {
    const value = text;
    setSearchTerm(value);
  };

  const handleSearchChatTerm = (text: string) => {
    setSearchChatTerm(text);
  };
  return (
    <div className="h-screen">
      <DrawerComponent
        isActiveDrawer={isActiveDrawer}
        closeDrawer={() => setIsActiveDrawer(false)}
      />
      <main className="flex h-app-height p-8 gap-x-6 bg-neutral-900">
        <section
          className="flex flex-col gap-6 h-full"
          style={{ width: "100%", maxWidth: "25vw", minWidth: "16rem" }}
        >
          <div className="flex justify-between items-center h-9">
            <button
              className="inline-flex h-9 w-12 justify-center items-center text-xl font-medium text-white bg-blue-700 rounded-full border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2"
              type="button"
              onClick={() => setIsActiveDrawer(true)}
            >
              <IoMdInformationCircleOutline />
            </button>
            <SearchInput
              height="full"
              type={"chats"}
              isActive={isActive}
              searchChatTerm={searchChatTerm}
              handleSearchChatTerm={handleSearchChatTerm}
            />
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className="inline-flex items-center py-2.5 px-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {isActive ? (
                <IoMdPeople className={`text-lg`} />
              ) : (
                <IoMdPersonAdd className={`text-lg `} />
              )}
            </button>
            <div
              className={`w-0 overflow-hidden custom-transition ${
                isActive ? "w-full visible ml-3" : "ml-0 w-0"
              }`}
            >
              <input
                type="text"
                id="voice-search"
                placeholder="Search new friend"
                onChange={(e) => handleInputChange(e.target.value)}
                className="overflow-hidden h-9 pr-9 w-full border text-sm rounded-lg focus:ring-gray-400 focus:border-gray-400 block pl-2 p-2.5 bg-neutral-800 border-neutral-600 placeholder-gray-400 text-white outline-none"
                required
              />
            </div>
          </div>
          <div className="flex flex-col border border-neutral-600 h-full rounded-xl overflow-hidden">
            <div
              className="flex overflow-hidden break-normal h-full py-2"
              ref={scroll}
            >
              <div
                className={`custom-transition ${
                  isActive ? "w-0 px-0" : "w-full px-2"
                } overflow-hidden overflow-y-auto custom-scrollbar`}
              >
                {chatsLoading ? (
                  <LoadingSpinner />
                ) : (
                  userChats?.map((chat: ChatType, index: any) => {
                    return (
                      <UserChat
                        key={index}
                        chat={chat}
                        activeChat={activeChat}
                        onlineUsers={onlineUsers}
                        searchChatTerm={searchChatTerm}
                        handleActiveChat={handleActiveChat}
                      />
                    );
                  })
                )}
              </div>
              <div
                className={`custom-transition ${
                  isActive ? "w-full px-2" : "w-0 px-0"
                } overflow-hidden`}
              >
                {loadingUsers ? (
                  <LoadingSpinner />
                ) : users.length > 0 ? (
                  users?.map((user, index) => (
                    <User
                      chats={userChats}
                      user={user}
                      key={index}
                      activeChat={activeChat}
                      handleActiveChat={handleActiveChat}
                      addFriend={addFriend}
                    />
                  ))
                ) : (
                  <div className="flex items-center w-full text-center justify-center h-full">
                    <div className="flex-col items-center mb-10">
                      <UserAddOutlined className="text-9xl text-neutral-700" />
                      <div className="text-neutral-400">Add new user!</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {!activeChat ? (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <span className="font-bold text-4xl mb-8">Pick chat</span>
            <img src={pickChat} className="w-full h-72 ml-5" alt="pick chat" />
          </div>
        ) : (
          <Messages
            activeChat={activeChat}
            messages={messages}
            messagesLoading={messagesLoading}
            recipient={recipient}
            sendMessage={sendMessage}
            firstMessageDate={firstMessageDate}
            handlePage={handlePage}
            page={page}
            deleteMessage={deleteMessage}
            deleteChat={deleteChat}
          />
        )}
      </main>
    </div>
  );
};
