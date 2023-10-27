import {
  AudioOutlined,
  PictureOutlined,
  SendOutlined,
} from "@ant-design/icons";
import React from "react";
import { MessageType, UserType } from "../../types/types";
import { BsEmojiSmile, BsFillReplyFill, BsXLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../../contexts/AuthContext";
import EmojiPicker, { Theme } from "emoji-picker-react";

interface IFooterMessages {
  messageInput: string;
  replyMessage: MessageType | null;
  recipient: UserType | null;
  handleSendMessage: (
    e: React.FormEvent<HTMLFormElement>,
    image: File | null,
    clearImage: () => void
  ) => void;
  handleMessageInput: (value: string) => void;
  clearReplyMessage: () => void;
}

function FooterMessages({
  messageInput,
  replyMessage,
  recipient,
  handleMessageInput,
  clearReplyMessage,
  handleSendMessage,
}: IFooterMessages) {
  const { auth } = useAuth();
  const [imageToSend, setImageToSend] = React.useState<File | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [isActiveEmoji, setIsActiveEmoji] = React.useState<boolean>(false);

  const imageRef = React.useRef<HTMLInputElement | null>(null);
  const inputMess = React.useRef<HTMLInputElement | null>(null);

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        return;
      }
      setImageToSend(file);
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    if (!imageRef.current) return;
    setImageUrl("");
    setImageToSend(null);
    imageRef.current.value = "";
  };

  const openInputImage = () => imageRef?.current?.click();

  return (
    <form
      onSubmit={(e) => handleSendMessage(e, imageToSend, clearImage)}
      className={`flex min-h-10 gap-4 justify-center items-${
        replyMessage ? "end" : "center"
      }`}
    >
      {/* <button type="button" >
        <LinkOutlined className="text-xl" />
      </button> */}
      <button onClick={openInputImage} type="button" className="rounded-full ">
        <PictureOutlined className="text-xl p-1 transition-colors hover:text-blue-600" />
        <input
          type="file"
          accept="image/png, image/jpeg"
          ref={imageRef}
          className="hidden"
          onChange={uploadImage}
        />
      </button>
      <div className="relative flex-col w-4/5 rounded-lg border focus:ring-gray-400 focus:border-gray-400 min-h-10 bg-neutral-800 border-neutral-600 placeholder-gray-400 text-white outline-none">
        {replyMessage ? (
          <div className="flex items-center p-2 gap-5 border-neutral-700 border-x-0  border-t-0 border-b-2">
            <div>
              <BsFillReplyFill
                className="pb-1 text-neutral-300 "
                style={{ fontSize: "2rem" }}
              />
            </div>
            <div className="block w-full">
              <div className="text-neutral-300 text-base font-bold">
                Reply for{" "}
                {replyMessage.senderId === recipient?._id
                  ? `${recipient.firstName} ${recipient.lastName}`
                  : `${auth?.firstName} ${auth?.lastName}`}
              </div>
              <div className="text-sm text-neutral-400 font-semibold">
                {replyMessage.deleted ? (
                  "Deleted message"
                ) : (
                  <div className="flex gap-2 items-center">
                    {replyMessage.image && (
                      <img
                        className="w-12 h-12 rounded-md"
                        srcSet={`message_images/${replyMessage.image}`}
                        src="reply-image"
                      />
                    )}
                    {replyMessage.text}
                  </div>
                )}
              </div>
            </div>
            <button
              className="justify-self-end w-6 text-2xl rounded-full"
              onClick={clearReplyMessage}
            >
              <BsXLg className="transition-colors hover:text-red-600" />
            </button>
          </div>
        ) : null}
        {imageUrl !== "" ? (
          <div className="w-20 h-20 rounded-tl-lg relative">
            <img
              src={imageUrl}
              alt="imageMessage"
              className="w-20 h-20 hover:cursor-pointer rounded-tl-lg z-0"
            />
            <div
              className="absolute flex justify-center items-center text-xl cursor-pointer top-0 left-0 w-full h-full opacity-0 z-10 rounded-tl-lg bg-black hover:opacity-40"
              onClick={clearImage}
            >
              <AiOutlineClose />
            </div>
          </div>
        ) : null}
        <input
          ref={inputMess}
          value={messageInput}
          onChange={(e) => handleMessageInput(e.target.value)}
          placeholder="Message"
          type="text"
          className="w-full h-10 px-2 pl-10  border-none outline-none text-sm bg-transparent"
        />
        <button
          type="button"
          style={{ bottom: 6 }}
          className="absolute right-2 flex items-center justify-center rounded-full p-1"
        >
          <AudioOutlined className="text-lg transition-colors hover:text-blue-600" />
        </button>
        <div
          onPointerEnter={() => setIsActiveEmoji(true)}
          onPointerLeave={() => setIsActiveEmoji(false)}
          className="absolute left-2 transition-colors hover:text-blue-600"
          style={{ bottom: 10 }}
        >
          <div className="relative">
            {isActiveEmoji ? (
              <div className="  absolute bottom-0 -left-2 z-10">
                <EmojiPicker
                  theme={Theme.DARK}
                  width={400}
                  searchDisabled={true}
                  height={300}
                  onEmojiClick={(ev) =>
                    handleMessageInput(inputMess?.current?.value + ev.emoji)
                  }
                />
              </div>
            ) : null}
          </div>
          <BsEmojiSmile className="text-xl cursor-pointer " />
        </div>
      </div>

      <button type="submit" className="rounded-full">
        <SendOutlined className="text-xl p-1 transition-colors hover:text-blue-600" />
      </button>
    </form>
  );
}

export default FooterMessages;
