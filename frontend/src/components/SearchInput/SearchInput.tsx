import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import { BsXLg } from "react-icons/bs";

interface ISearchInput {
  height: string;
  isActive?: boolean;
  searchChatTerm?: string;
  type: string;
  searchMessageTerm?: {
    text: string;
    isActive: string;
  };
  handleSearchChatTerm?: (term: string) => void;
  handleSearchMessages?: (term: string) => void;
  offSearchMessage?: () => void;
  onChange?: (term: string) => void;
}

function SearchInput({
  height,
  isActive,
  searchChatTerm,
  type,
  searchMessageTerm,
  handleSearchChatTerm,
  handleSearchMessages,
  onChange,
  offSearchMessage,
}: ISearchInput) {
  return (
    <div
      className={`relative ${
        type === "messages" ? "visible" : "overflow-hidden"
      } ${
        isActive
          ? "w-0 mr-0 max-[950px]:h-0"
          : `${
              type === "messages"
                ? "w-fit mr-3"
                : "w-full max-[950px]:h-auto pl-2"
            } `
      } h-${height}  custom-transition z-1 hover:opacity-80`}
    >
      <input
        type="text"
        value={type === "messages" ? searchMessageTerm?.text : searchChatTerm}
        onChange={(e) =>
          type === "chats"
            ? handleSearchChatTerm && handleSearchChatTerm(e.target.value)
            : onChange && onChange(e.target.value)
        }
        id={`search-${type}`}
        style={{ maxWidth: type === "messages" ? 200 : "" }}
        placeholder="Search"
        className={`h-full pr-9 ${
          searchMessageTerm?.isActive ? "pr-16" : ""
        } border text-sm rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full pl-2 p-2.5 bg-neutral-800 border-neutral-600 placeholder-gray-400 text-white outline-none`}
        required
      />
      <div className="absolute inset-y-0 right-0 flex pr-2 gap-1 items-center">
        <button
          type="button"
          className=" flex items-center rounded-full p-1 transition-colors hover:text-blue-600"
          onClick={() =>
            type === "messages" &&
            handleSearchMessages &&
            searchMessageTerm?.text &&
            handleSearchMessages(searchMessageTerm.text)
          }
        >
          <SearchOutlined />
        </button>
        {searchMessageTerm?.isActive ? (
          <>
            <span className="pb-1">|</span>
            <button
              type="button"
              className="flex items-center"
              onClick={offSearchMessage}
            >
              <BsXLg className="font-bold transition-colors hover:text-red-600" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default SearchInput;
