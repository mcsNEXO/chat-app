import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../axios";
import ImageModal from "../ImageModal/ImageModal";
import { UserType } from "../../types/types";

function Header() {
  //states
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string>("");

  //contexts
  const { auth, setAuth } = useAuth();

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        return;
      }
      setSelectedImage(file);
      setSelectedImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const saveImage = async () => {
    if (!selectedImage) return;
    const formdata = new FormData();
    formdata.append("image", selectedImage);
    if (auth) {
      formdata.append("_id", auth._id);
      formdata.append("imageName", auth.urlProfileImage);
    }
    try {
      const res = await apiClient.sendRequest({
        method: "put",
        url: "users/updateImage",
        data: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const user = res.data as UserType;
      setAuth(user);
      setIsOpenModal(false);
      handleCloseModal();
    } catch (error) {
      throw new Error(error as any);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedImageUrl("");
    setIsOpenModal(false);
  };

  const deleteUserImage = async () => {
    try {
      const res = await apiClient.sendRequest({
        method: "put",
        url: `users/deleteImage/${auth?._id}`,
      });
      const user = res.data as UserType;
      setAuth(user);
      handleCloseModal();
    } catch (error) {
      throw new Error(error as any);
    }
  };

  return (
    <>
      {isOpenModal && auth ? (
        <ImageModal
          userImage={auth?.urlProfileImage}
          selectedImage={selectedImage}
          selectedImageUrl={selectedImageUrl}
          handleUploadImage={uploadImage}
          saveImage={saveImage}
          handleCloseModal={handleCloseModal}
          handleDeleteUserImage={deleteUserImage}
        />
      ) : null}
      <section className="flex justify-between items-center px-14 pt-2 h-28  bg-dark-gray">
        <div className="text-3xl font-bold">Chatify</div>
        <div className="flex h-full items-center">
          <div className="block">
            <div className="text-ms">{`${auth?.firstName} ${auth?.lastName}`}</div>
            <div className="text-xs">{auth?.email}</div>
          </div>
          <img
            src={`uploads/${auth?.urlProfileImage}`}
            alt="profile-img"
            onClick={() => setIsOpenModal(true)}
            className="p-4 rounded-full h-full hover:cursor-pointer"
            style={{ width: 104 }}
          />
        </div>
      </section>
    </>
  );
}

export default Header;
