import { CloseCircleOutlined } from "@ant-design/icons";
import React from "react";
import "react-image-crop/src/ReactCrop.scss";

interface ImageModal {
  userImage: string;
  selectedImage: File | null;
  selectedImageUrl: string;
  handleUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveImage: () => Promise<void>;
  handleCloseModal: () => void;
  handleDeleteUserImage: () => Promise<void>;
}

function ImageModal({
  userImage,
  selectedImage,
  selectedImageUrl,
  handleUploadImage,
  saveImage,
  handleCloseModal,
  handleDeleteUserImage,
}: ImageModal) {
  const fileRef: React.LegacyRef<any> = React.useRef();
  const imageRef = React.useRef<any>();

  const handleOpenInputFile = () => {
    fileRef.current.click();
  };

  return (
    <div className="fixed w-screen top-0 left-0 h-screen bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm z-100">
      <div
        className="relative flex flex-col justify-between items-center bg-dark-gray p-6 rounded-xl"
        style={{
          width: "clamp(400px,40%,550px)",
          height: "clamp(600px,600px,600px",
        }}
      >
        {/* {selectedImageUrl ? (
          <CircleImageCrop
            imageSrc={selectedImageUrl}
            selectedImage={selectedImage}
            imageRef={imageRef.current}
          />
        ) : null} */}
        <button
          className="absolute right-4 top-2"
          onClick={() => handleCloseModal()}
        >
          <CloseCircleOutlined className="text-3xl text-red-500" />
        </button>
        <img
          src={selectedImageUrl ? selectedImageUrl : `uploads/${userImage}`}
          alt="userImage"
          className="w-full hover:cursor-pointer rounded-full"
          onClick={handleOpenInputFile}
        />
        {/* {selectedImage ? null : (
          <div className="w-80 h-80 border-dotted border-pink rounded-full overflow-hidden ">
            <img
              src={selectedImageUrl ? selectedImageUrl : `uploads/${userImage}`}
              alt="userImage"
              ref={imageRef}
              className="w-full h-full hover:cursor-pointer "
              onClick={handleOpenInputFile}
            />
          </div>
        )} */}
        <div className="flex justify-around w-full px-2">
          <button
            className="bg-primary px-3 py-1 rounded-md"
            onClick={handleOpenInputFile}
          >
            Upload
            <input
              type="file"
              className="hidden"
              ref={fileRef}
              onChange={handleUploadImage}
            />
          </button>
          {selectedImage ? (
            <button
              className="bg-green-700 px-3 py-1 rounded-md"
              onClick={saveImage}
            >
              Save
            </button>
          ) : null}
          {userImage && userImage !== "avatar.png" && !selectedImageUrl ? (
            <button
              className="bg-red-700 px-3 py-1 rounded-md"
              onClick={handleDeleteUserImage}
            >
              Delete
            </button>
          ) : null}
          <button
            className="bg-red-700 px-3 py-1 rounded-md"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageModal;
