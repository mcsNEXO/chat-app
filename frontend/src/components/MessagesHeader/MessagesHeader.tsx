import SearchInput from "../SearchInput/SearchInput";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  MoreOutlined,
  PhoneOutlined,
  SearchOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { UserType } from "../../types/userTypes";
import React from "react";
import { BsXLg } from "react-icons/bs";

interface IMessageHeader {
  recipient: UserType | null;
  searchedMessagesLength: number;
  currentIndex: number;
  searchTermMessage: {
    text: string;
    isActive: string;
  };
  isActiveOption: boolean;
  handleSearchMessages: () => Promise<void>;
  deleteChat: () => Promise<void>;
  onChange: (term: string) => void;
  scrollUp: () => void;
  scrollDown: () => void;
  handleActiveOption: () => void;
  offSearchMessage: () => void;
}

function MessagesHeader({
  recipient,
  searchedMessagesLength,
  currentIndex,
  searchTermMessage,
  isActiveOption,
  handleSearchMessages,
  deleteChat,
  onChange,
  scrollDown,
  scrollUp,
  handleActiveOption,
  offSearchMessage,
}: IMessageHeader) {
  const [activeSearcher, setActiveSearcher] = React.useState<boolean>(false);

  const searcher = (
    <>
      <SearchInput
        height="8"
        type={"messages"}
        searchMessageTerm={searchTermMessage}
        handleSearchMessages={handleSearchMessages}
        onChange={onChange}
        offSearchMessage={offSearchMessage}
      />
      <div
        className={`flex ${
          searchTermMessage.isActive ? "gap-2" : "gap-1"
        } py-1 items-center rounded-xl mr-6`}
      >
        <button
          onClick={scrollUp}
          disabled={searchedMessagesLength > 0 ? false : true}
          className="bg-neutral-700 w-7 h-7 rounded-full flex items-center justify-center pb-1 disabled:opacity-50 hover:disabled:text-neutral-200 transition-colors hover:text-gray-300 hover:bg-neutral-800"
        >
          <UpOutlined className="text-sm" />
        </button>
        {currentIndex !== undefined ? (
          <div
            className={`flex justify-center bg-neutral-700 rounded-md bg-opacity-70 text-neutral-400 transition-all whitespace-nowrap ${
              searchTermMessage.isActive
                ? "min-w-12 w-12 max-w-20  px-2 "
                : "w-0 px-0"
            } overflow-hidden `}
          >
            {currentIndex + 1}/{searchedMessagesLength}
          </div>
        ) : null}
        <button
          onClick={scrollDown}
          disabled={searchedMessagesLength > 0 ? false : true}
          className="bg-neutral-700 w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-50 hover:disabled:text-neutral-200 transition-colors hover:text-gray-300 hover:bg-neutral-800"
        >
          <DownOutlined className="text-sm" />
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-col border border-x-0 border-t-0 border-neutral-600 max-[950px]:pb-2">
        <div className="flex justify-between relative  h-20 pb-4 max-[950px]:">
          <div className="flex items-center gap-6 h-full">
            <img
              src={`uploads/${recipient?.urlProfileImage}`}
              alt="friend"
              className="h-16 w-16 rounded-full"
            />
            <div className="text-lg font-bold truncate">{`${recipient?.firstName} ${recipient?.lastName}`}</div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center max-[950px]:hidden">
              {searcher}
            </div>

            <div className="flex gap-4">
              <button className="flex items-center rounded-full">
                <PhoneOutlined
                  rotate={90}
                  className="text-2xl p-1 transition-colors hover:text-blue-600"
                />
              </button>
              <button
                className="flex items-center rounded-full transition-colors hover:text-blue-600"
                onClick={handleActiveOption}
              >
                <MoreOutlined className="text-2xl" />
              </button>
            </div>
          </div>
        </div>{" "}
        {isActiveOption ? (
          <div className="absolute top-28 right-12 z-10 w-52 bg-neutral-800 p-2 rounded-md line text-base">
            <button
              type="button"
              className="flex justify-start rounded-lg w-full h-10 gap-6 items-center text-neutral-300 font-bold text-base hover:bg-dark-gray cursor-pointer px-2 "
              onClick={handleActiveOption}
            >
              <EditOutlined
                className="font-bold"
                style={{ fontSize: "1.4rem" }}
              />
              Edit nickname
            </button>
            <button
              type="button"
              className="hidden justify-start rounded-lg w-full h-10 gap-6 items-center text-neutral-300 font-bold text-base px-2 hover:bg-dark-gray cursor-pointer max-[950px]:flex"
              onClick={() => {
                setActiveSearcher(true);
                handleActiveOption();
              }}
            >
              <SearchOutlined
                className="font-bold"
                style={{ fontSize: "1.4rem" }}
              />
              Search message
            </button>
            <button
              type="button"
              className="flex justify-start rounded-lg w-full h-10 gap-6 items-center text-red-700 font-bold text-base px-2 hover:bg-dark-gray cursor-pointer"
              onClick={deleteChat}
            >
              <DeleteOutlined
                className="font-bold"
                style={{ fontSize: "1.4rem" }}
              />
              Delete chat
            </button>
          </div>
        ) : null}{" "}
        {activeSearcher ? (
          <div
            className={`hidden w-full justify-center pl-4 items-center max-[950px]:${
              activeSearcher ? "flex" : ""
            } `}
          >
            {searcher}
            <button
              type="button"
              className="rounded-full p-2 text-xl"
              onClick={() => setActiveSearcher(false)}
            >
              <BsXLg />
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default MessagesHeader;
