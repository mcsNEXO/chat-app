import SearchInput from "../SearchInput/SearchInput";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  MoreOutlined,
  PhoneOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { UserType } from "../../types/userTypes";

interface IMessageHeader {
  recipient: UserType | null;
  searchedMessagesLength: number;
  currentIndex: number;
  searchTermMessage: {
    text: string;
    isActive: boolean;
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
  return (
    <>
      <div className="flex justify-between border border-x-0 border-t-0 border-neutral-600 h-20 pb-4">
        <div className="flex items-center gap-6 h-full">
          <img
            src={`uploads/${recipient?.urlProfileImage}`}
            alt="friend"
            className="h-16 w-16 rounded-full"
          />
          <div className="text-lg font-bold">{`${recipient?.firstName} ${recipient?.lastName}`}</div>
        </div>
        <div className="flex items-center">
          <SearchInput
            height="8"
            type={"messages"}
            searchMessageTerm={searchTermMessage}
            handleSearchMessages={handleSearchMessages}
            onChange={onChange}
            offSearchMessage={offSearchMessage}
          />
          <div
            className={`flex gap-${
              searchTermMessage.isActive ? "3" : "2"
            } py-1 items-center rounded-xl mr-6`}
          >
            <button
              onClick={scrollUp}
              disabled={searchedMessagesLength > 0 ? false : true}
              className="bg-neutral-700 w-7 h-7 rounded-full flex items-center justify-center pb-1 disabled:opacity-50"
            >
              <UpOutlined className="text-sm" />
            </button>
            {currentIndex !== undefined ? (
              <div
                className={`bg-neutral-700 rounded-md bg-opacity-70 text-neutral-400 transition-all whitespace-nowrap ${
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
              className="bg-neutral-700 w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-50"
            >
              <DownOutlined className="text-sm" />
            </button>
          </div>
          <div className="flex gap-6">
            <button className="flex items-center">
              <PhoneOutlined rotate={90} className="text-2xl pb-2" />
            </button>
            <button className="flex items-center" onClick={handleActiveOption}>
              <MoreOutlined className="text-2xl pb-2" />
            </button>
          </div>
        </div>
      </div>{" "}
      {isActiveOption ? (
        <div className="absolute top-28 right-12 z-10 w-52 bg-neutral-800 p-2 rounded-md line text-base">
          <div className="flex justify-start h-10 gap-6 items-center text-neutral-300 font-bold text-base hover:bg-dark-gray cursor-pointer px-2 ">
            <EditOutlined
              className="font-bold"
              style={{ fontSize: "1.4rem" }}
            />
            Edit nickname
          </div>
          <div
            className="flex justify-start h-10 gap-6 items-center text-red-700 font-bold text-base px-2 hover:bg-dark-gray cursor-pointer"
            onClick={deleteChat}
          >
            <DeleteOutlined
              className="font-bold"
              style={{ fontSize: "1.4rem" }}
            />
            Delete chat
          </div>
        </div>
      ) : null}
    </>
  );
}

export default MessagesHeader;
