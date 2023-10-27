import React, { useState } from "react";
import { ChatType, MessageType, UserType } from "../../types/userTypes";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { apiClient } from "../../axios";
import Message from "../Message/Message";
import MessagesHeader from "../MessagesHeader/MessagesHeader";
import FooterMessages from "../FooterMessages/FooterMessages";

interface IMessages {
  activeChat: ChatType | null;
  messages: MessageType[];
  messagesLoading: boolean;
  recipient: UserType | null;
  firstMessageDate: string;
  page: number;
  handlePage: () => void;
  deleteMessage: (messageId: string, recipientId: string) => Promise<void>;
  sendMessage: (
    textMessage: string,
    sender: string,
    activeChatId: string,
    replayMessage: MessageType | null,
    image: File | null
  ) => Promise<{ success: boolean }>;
  deleteChat: () => Promise<void>;
}

function Messages({
  activeChat,
  messages,
  firstMessageDate,
  messagesLoading,
  page,
  recipient,
  deleteChat,
  handlePage,
  sendMessage,
  deleteMessage,
}: IMessages) {
  //states
  const [messageInput, setMessageInput] = React.useState<string>("");
  const [searchTermMessage, setSearchTermMessage] = React.useState<{
    text: string;
    isActive: string;
  }>({
    text: "",
    isActive: "",
  });
  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);
  const [currentIndex, setCurrenIndex] = useState<number>(-1);
  const [isActiveOption, setIsActiveOption] = useState<boolean>(false);
  const [isActiveMessOption, setIsActiveMessOption] = useState<number>(-1);
  const [searchedMessages, setSearchedMessages] = useState<MessageType[]>([]);
  const [replayMessage, setReplyMessage] = useState<MessageType | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndexImg, setCurrentIndexImg] = useState<number>(
    images?.length - 1
  );

  //context
  const { auth } = useAuth();

  //ref
  const scroll = React.useRef<HTMLDivElement | null>(null);

  const shouldDisplayDate = (currentMessage: MessageType, index: number) => {
    if (index === 0) return true;
    else {
      const prevMessage = messages[index - 1];

      return (
        new Date(currentMessage.createdAt).toDateString() !==
        new Date(prevMessage.createdAt).toDateString()
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>,
    image: File | null,
    clearImage: () => void
  ) => {
    e.preventDefault();
    if (!auth) return;
    if (!activeChat) return;
    try {
      const success = await sendMessage(
        messageInput,
        auth?._id,
        activeChat?._id,
        replayMessage,
        image
      );
      if (success.success && scroll.current) {
        setTimeout(() => {
          scroll?.current?.scroll({
            top: scroll.current.scrollHeight,
            behavior: scroll.current.scrollTop > 785 ? "smooth" : "instant",
          });
        }, 50);
      }
      setMessageInput("");
      clearImage();
      replayMessage && setReplyMessage(null);
    } catch (error) {
    } finally {
    }
  };

  const handleSearchMessages = async () => {
    const res = await apiClient.sendRequest({
      method: "get",
      url: `message/findMessages?chatId=${activeChat?._id}&term=${searchTermMessage.text}`,
    });
    const data: any = res.data;

    setSearchedMessages(data.findedMessages as MessageType[]);
    setSearchTermMessage((prev) => {
      return { ...prev, isActive: prev.text };
    });
  };

  const scrollToWord = (type: "top" | "down") => {
    if (!searchTermMessage && searchedMessages.length === 0) return;
    const x = messages.findIndex(
      (x) =>
        x?._id ===
        searchedMessages[currentIndex - (type === "top" ? -1 : 1)]?._id
    );
    if (type === "top") {
      if (currentIndex + 1 === searchedMessages.length) return;
      if (x < 0) return handlePage();
      setCurrenIndex((prev) => prev + 1);
    } else if (type === "down") {
      if (currentIndex - 1 === -1) return;
      if (x < 0) return;
      setCurrenIndex((prev) => prev - 1);
    }
    const element = document.querySelector(`[data-key="${x}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scroll.current) {
      if (
        scroll.current.scrollTop === 0 &&
        !messagesLoading &&
        firstMessageDate !== messages[0]?.createdAt &&
        firstMessageDate
      ) {
        handlePage();
      }
    }
  };
  React.useEffect(() => {
    setCurrenIndex(-1);
  }, [searchTermMessage, activeChat]);
  React.useEffect(() => {
    if (scroll.current && page === 1) {
      if (messages) {
        scroll.current.scroll({
          top: scroll.current.scrollHeight,
          behavior: "instant",
        });
      } else {
        scroll.current.scrollTop = scroll.current.scrollHeight;
      }
    }
    if (searchTermMessage && searchedMessages.length !== 0) {
      scrollToWord("top");
    }
    const mapImages = messages
      .filter((x) => x.image !== null)
      .map((x) => `message_images/${x.image!}`);
    if (mapImages.length > images.length) {
      setImages(mapImages);
      setCurrentIndexImg(mapImages.length - 1);
    }
  }, [messages, activeChat]);
  React.useEffect(() => {
    if (!scroll.current) return;
    scroll.current.scrollTop = scroll.current.scrollHeight - prevScrollHeight;
    setPrevScrollHeight(scroll.current.scrollHeight);
  }, [page]);

  const handleDeleteChat = async () => {
    deleteChat();
    setIsActiveOption(false);
  };

  const deleteOne = async (messageId: string) => {
    try {
      if (recipient) deleteMessage(messageId, recipient?._id);
    } catch (error) {
      throw new Error(error as any);
    }
  };

  const getCurrentScrollTop = (index: number) => {
    const placeElement = index * 80;
    const diff = placeElement - scroll.current!.scrollTop;
    return diff > 0 ? "top" : "bottom";
  };

  const handleClearReplyMessage = () => {
    setReplyMessage(null);
  };

  const offSearchMessage = () => {
    setSearchTermMessage({ isActive: "", text: "" });
  };

  const hideOption = () => {
    setIsActiveOption(false);
    setIsActiveMessOption(-1);
  };

  const getMoreImages = async () => {
    try {
      const res = await apiClient.sendRequest({
        url: `message/getMoreImages/${activeChat?._id}/${images.length + 3}`,
        method: "get",
      });
      const data = res.data as string[];
      setImages(data);
    } catch (error) {}
  };
  React.useEffect(() => {
    getMoreImages();
  }, []);

  return (
    <>
      {isActiveOption || isActiveMessOption > -1 ? (
        <div
          className="absolute top-0 left-0 w-screen h-screen z-10"
          onClick={hideOption}
        ></div>
      ) : null}

      <section className="h-full w-full gap-4 flex flex-col border border-neutral-600 rounded-xl p-5 overflow-hidden relative ">
        {activeChat ? (
          <>
            <MessagesHeader
              recipient={recipient}
              searchedMessagesLength={searchedMessages.length}
              searchTermMessage={searchTermMessage}
              currentIndex={currentIndex}
              isActiveOption={isActiveOption}
              deleteChat={handleDeleteChat}
              handleSearchMessages={handleSearchMessages}
              offSearchMessage={offSearchMessage}
              onChange={(term: string) =>
                setSearchTermMessage((prev) => {
                  return { ...prev, text: term };
                })
              }
              scrollUp={() => scrollToWord("top")}
              scrollDown={() => scrollToWord("down")}
              handleActiveOption={() => setIsActiveOption(!isActiveOption)}
            />

            <div
              className={`flex-grow flex-col custom-scrollbar relative overflow-y-scroll`}
              onScroll={handleScroll}
              ref={scroll}
            >
              {messagesLoading ? <LoadingSpinner /> : null}
              {messages?.map((message, index) => {
                return (
                  <Message
                    key={index}
                    images={images.reverse()}
                    index={index}
                    message={message}
                    recipient={recipient}
                    setCurrentIndexImg={setCurrentIndexImg}
                    searchTermMessage={searchTermMessage}
                    searchedMessages={searchedMessages}
                    activeMessOption={isActiveMessOption}
                    getMoreImages={getMoreImages}
                    handleReplyMessage={(message: MessageType) =>
                      setReplyMessage(message)
                    }
                    shouldDisplayDate={() => shouldDisplayDate(message, index)}
                    formatDate={() => formatDate(message.createdAt)}
                    handleActiveMessOption={() =>
                      setIsActiveMessOption((prev) =>
                        prev === index ? -1 : index
                      )
                    }
                    handleDeleteMessage={() => deleteOne(message._id)}
                    getCurrentScrollTop={getCurrentScrollTop}
                    currentIndexImg={currentIndexImg}
                  />
                );
              })}
            </div>
            <div
              className="bg-neutral-600 w-11/12 mx-auto"
              style={{ height: 1 }}
            ></div>
            <FooterMessages
              messageInput={messageInput}
              replyMessage={replayMessage}
              recipient={recipient}
              clearReplyMessage={handleClearReplyMessage}
              handleMessageInput={setMessageInput}
              handleSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <div>Pick chat</div>
        )}
      </section>
    </>
  );
}
const MemoizedMessages = React.memo(Messages);
export default MemoizedMessages;
