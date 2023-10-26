import React from "react";
import { ChatType, MessageType, UserType } from "../../types/userTypes";
import { useAuth } from "../../contexts/AuthContext";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DownloadOutlined,
  MoreOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapLeftOutlined,
  SwapOutlined,
  SwapRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { BsFillReplyFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { Space, Image } from "antd";
import { apiClient } from "../../axios";

interface IMessage {
  index: number;
  images: string[];
  message: MessageType;
  searchTermMessage: {
    text: string;
    isActive: string;
  };
  currentIndexImg: number;
  searchedMessages: MessageType[];
  activeMessOption: number;
  recipient: UserType | null;
  getCurrentScrollTop: (index: number) => "top" | "bottom";
  shouldDisplayDate: () => boolean;
  formatDate: () => string;
  handleActiveMessOption: () => void;
  handleDeleteMessage: () => Promise<void>;
  getMoreImages: () => Promise<void>;
  handleReplyMessage: (message: MessageType) => void;
  setCurrentIndexImg: React.Dispatch<React.SetStateAction<number>>;
}

function Message({
  index,
  images,
  message,
  searchTermMessage,
  searchedMessages,
  currentIndexImg,
  activeMessOption,
  recipient,
  getCurrentScrollTop,
  shouldDisplayDate,
  formatDate,
  handleActiveMessOption,
  handleDeleteMessage,
  handleReplyMessage,
  setCurrentIndexImg,
  getMoreImages,
}: IMessage) {
  const { auth } = useAuth();
  const isSender = message.senderId === auth?._id;
  const isDeleted = message?.deleted;

  const displayDate =
    !isDeleted &&
    (shouldDisplayDate() ? (
      <div className="w-fit mx-auto text-center text-gray-400 bg-neutral-400 bg-opacity-20 px-3 rounded-xl">
        {formatDate()}
      </div>
    ) : null);

  const onDownload = (src: string) => {
    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  const renderRepliedToMessage = message.repliedTo && !message?.deleted && (
    <div
      className={`absolute -top-1 text-right text-base ${
        isSender
          ? "items-end justify-end right-3"
          : "items-start justify-start left-3"
      } flex flex-col`}
    >
      <span className="text-sm text-neutral-400 text-opacity-90 pr-2 flex items-center gap-1">
        <BsFillReplyFill />
        {message.repliedTo.senderId !== message.senderId
          ? `Replied to ${recipient?.firstName} ${recipient?.lastName}`
          : isSender
          ? "You replied yourself"
          : `You replied ${recipient?.firstName} ${recipient?.lastName}`}
      </span>
      <div
        className={`${
          isDeleted
            ? "bg-transparent border-neutral-500"
            : "bg-neutral-600 border-neutral-600"
        } flex-col w-fit rounded-lg border order-1 px-2 py-1 z-0 text-neutral-400`}
      >
        {message?.repliedTo?.text}
      </div>
    </div>
  );
  return (
    <div>
      {displayDate}
      <div
        className={`flex ${
          isSender ? "justify-end" : "justify-start"
        } h-auto p-2 group hover:visible`}
      >
        <div
          style={{
            minHeight: message.repliedTo && !message?.deleted ? 96 : 0,
          }}
          className={`w-1/3 relative flex items-${
            message?.repliedTo ? "end" : "center"
          } ${isSender ? "justify-end" : "justify-start"}`}
        >
          {renderRepliedToMessage}
          <div
            className={`${
              isDeleted
                ? "bg-transparent border-neutral-500"
                : isSender
                ? "bg-blue-700 border-blue-700"
                : "bg-neutral-700 border-neutral-700"
            } flex-col w-fit rounded-lg border order-1 px-2 py-1`}
            style={{ zIndex: 1 }}
          >
            <div
              data-key={index}
              className={`message-el  ${
                isDeleted
                  ? "text-neutral-400"
                  : searchTermMessage.isActive &&
                    searchedMessages.length > 0 &&
                    message.text === searchTermMessage.isActive
                  ? "bg-yellow-400"
                  : ""
              }`}
            >
              {isDeleted ? (
                "Deleted message"
              ) : (
                <>
                  {message.image ? (
                    <div className="py-1">
                      <Image.PreviewGroup
                        items={images}
                        icons={{
                          right: (
                            <ArrowRightOutlined
                              onClick={() => {
                                if (
                                  currentIndexImg ===
                                  Math.floor((images.length - 1) / 2)
                                ) {
                                  getMoreImages();
                                }
                                setCurrentIndexImg((prev) =>
                                  prev + 1 < images.length - 1
                                    ? prev + 1
                                    : images.length - 1
                                );
                              }}
                            />
                          ),
                          left: (
                            <ArrowLeftOutlined
                              onClick={() =>
                                setCurrentIndexImg((prev) =>
                                  prev - 1 > -1 ? prev - 1 : 0
                                )
                              }
                            />
                          ),
                        }}
                        preview={{
                          className: "bg-opacity-40 bg-black",
                          current: currentIndexImg,
                          toolbarRender: (
                            _,
                            {
                              transform: { scale },
                              actions: {
                                onFlipY,
                                onFlipX,
                                onRotateLeft,
                                onRotateRight,
                                onZoomOut,
                                onZoomIn,
                              },
                            }
                          ) => (
                            <Space className="text-xl gap-5 bg-black px-5 py-1 rounded-xl bg-opacity-50">
                              <DownloadOutlined
                                onClick={() =>
                                  onDownload(`message_images/${message.image}`)
                                }
                              />
                              <SwapOutlined rotate={90} onClick={onFlipY} />
                              <SwapOutlined onClick={onFlipX} />
                              <RotateLeftOutlined onClick={onRotateLeft} />
                              <RotateRightOutlined onClick={onRotateRight} />
                              <ZoomOutOutlined
                                disabled={scale === 1}
                                onClick={onZoomOut}
                              />
                              <ZoomInOutlined
                                disabled={scale === 50}
                                onClick={onZoomIn}
                              />
                            </Space>
                          ),
                        }}
                      >
                        <Image
                          width={150}
                          src={`message_images/${message.image}`}
                          onClick={() =>
                            // {
                            //   if(images.length < 1){
                            //     getMoreImages(crIndex)
                            //   }
                            // }

                            setCurrentIndexImg(
                              images.findIndex(
                                (x) => x === `message_images/${message.image}`
                              )
                            )
                          }
                        />
                      </Image.PreviewGroup>
                    </div>
                  ) : null}
                  {message.text}
                </>
              )}
            </div>
            <div className="text-xs text-neutral-300 text-right">
              {isDeleted && "Deleted at "}
              {new Intl.DateTimeFormat(
                "pl-PL",
                message.deleted
                  ? {
                      hour: "2-digit",
                      minute: "2-digit",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  : { hour: "2-digit", minute: "2-digit" }
              ).format(
                new Date(
                  isDeleted && message.deletedAt
                    ? message.deletedAt
                    : message.createdAt
                )
              )}
            </div>
          </div>
          <div
            className={`relative ${
              activeMessOption === index ? "visible" : "hidden"
            } group-hover:block order-${
              isSender ? "0" : "1"
            } cursor-pointer px-1 group hover:visible`}
            onClick={handleActiveMessOption}
          >
            <div
              mess-key={index}
              className={`w-max bg-neutral-800 opacity-90 px-5 py-2 rounded-md absolute -top-11 z-10 ${
                activeMessOption === index
                  ? `visible ${
                      getCurrentScrollTop(index) === "top"
                        ? "-top-11"
                        : "top-11"
                    }`
                  : "hidden"
              } ${isSender ? "right-8" : "left-8"}`}
              style={{ minWidth: 150 }}
            >
              <div
                className="flex items-center gap-4 font-semibold"
                onClick={() => handleReplyMessage(message)}
              >
                <BsFillReplyFill className="text-2xl" /> Reply
              </div>
              {!isDeleted && isSender && (
                <div
                  className="flex items-center gap-4 text-red-600 mt-3 font-bold"
                  onClick={handleDeleteMessage}
                >
                  <AiFillDelete
                    style={{ fontSize: "1.4rem" }}
                    className="font-bold"
                  />{" "}
                  Delete message
                </div>
              )}
            </div>
            <MoreOutlined className="text-xl pb-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
