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
    isActive: boolean;
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
        isActive ? "w-0 mr-0" : "w-full mr-3"
      } h-${height}  custom-transition z-1 ${
        type === "messages" ? "visible" : "overflow-hidden"
      }`}
    >
      <input
        type="text"
        value={type === "messages" ? searchMessageTerm?.text : searchChatTerm}
        onChange={(e) =>
          type === "chats"
            ? handleSearchChatTerm && handleSearchChatTerm(e.target.value)
            : onChange && onChange(e.target.value)
        }
        id=""
        placeholder="Search"
        className="h-full pr-9 border text-sm rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full pl-2 p-2.5 bg-neutral-800 border-neutral-600 placeholder-gray-400 text-white outline-none"
        required
      />
      <div className="absolute inset-y-0 right-0 flex pr-2 gap-1 items-center">
        <button
          type="button"
          className=" flex items-center "
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
              <BsXLg />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default SearchInput;
