import { App, Button, Drawer } from "antd";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import ImageModal from "../ImageModal/ImageModal";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../axios";
import { UserType } from "../../types/userTypes";
import { validate } from "../../helpers/validations";

interface IEditDrawer {
  closeEditDrawer: () => void;
  isActiveEdit: boolean;
}

type FormTypes =
  | "email"
  | "currentPassword"
  | "newPassword"
  | "confirmPassword";

function EditDrawer({ isActiveEdit, closeEditDrawer }: IEditDrawer) {
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string>("");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const { auth, setAuth } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { message } = App.useApp();
  const [form, setForm] = React.useState({
    email: {
      value: auth?.email,
      error: "",
      rules: [{ rule: "min", number: 5 }, "required", "email"],
    },
    currentPassword: {
      value: "",
      error: "",
      rules: ["required"],
    },
    newPassword: {
      value: "",
      error: "",
      rules: ["required", { rule: "min", number: 6 }],
    },
    confirmPassword: {
      value: "",
      error: "",
      rules: ["required"],
    },
  });

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
    setLoading(true);
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
      if (res.status === 200)
        message.success("Your profile image has been updated ");
    } catch (error) {
      throw new Error(error as any);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedImageUrl("");
    setIsOpenModal(false);
  };

  const deleteUserImage = async () => {
    setLoading(true);
    try {
      const res = await apiClient.sendRequest({
        method: "put",
        url: `users/deleteImage/${auth?._id}`,
      });
      const user = res.data as UserType;
      setAuth(user);
      handleCloseModal();
      if (res.status === 200)
        message.success("Your profile image has been deleted ");
    } catch (error) {
      throw new Error(error as any);
    } finally {
      setLoading(false);
    }
  };

  const onChangeInput = (value: string, type: FormTypes) => {
    const { error } = validate(form[type].rules, value, type);
    setForm({
      ...form,
      [type]: {
        ...form[type],
        value,
        error: error,
      },
    });
  };

  const updateEmail = async () => {
    setLoading(true);
    try {
      if (form.email.value === auth?.email) return;
      const errorInput =
        form.email.error !== "" || form.email.value === "" ? true : false;
      if (errorInput) return;
      const res = await apiClient.sendRequest({
        method: "put",
        url: "users/editEmail",
        data: { email: form.email.value },
      });
      setAuth(res.data as UserType);
      if (res.status === 200) message.success("Your email has been changed");
    } catch (err: any) {
      message.error(
        `${
          err?.response?.data?.message
            ? `Error: ${err?.response?.data?.message}`
            : "Something went wrong"
        } `
      );
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    setLoading(true);
    try {
      const errorInput = Object.values(form).find(
        (x) => x.error !== "" || (x.value === "" && !x.rules.includes("email"))
      );
      if (errorInput) return;
      if (form.newPassword.value !== form.confirmPassword.value) {
        return setForm({
          ...form,
          confirmPassword: {
            ...form.confirmPassword,
            error: "Your passwords aren't match",
          },
          newPassword: {
            ...form.newPassword,
            error: "Your passwords aren't match",
          },
        });
      }
      const res = await apiClient.sendRequest({
        method: "put",
        url: "users/editPassword",
        data: {
          currentPassword: form.currentPassword.value,
          newPassword: form.newPassword.value,
          confirmPassword: form.confirmPassword.value,
        },
      });
      setAuth(res.data as UserType);
      if (res.status === 200) message.success("Your password has been changed");
    } catch (err: any) {
      message.error(
        `${
          err?.response?.data?.message
            ? `Error: ${err?.response?.data?.message}`
            : "Something went wrong"
        } `
      );
      throw new Error(err as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      width={320}
      bodyStyle={{
        padding: 0,
        backgroundColor: "Background",
        borderRight: "1px solid rgba(255, 255, 255, 40%)",
        overflowY: "hidden",
      }}
      closable={false}
      placement="left"
      onClose={closeEditDrawer}
      open={isActiveEdit}
    >
      <div className="overflow-y-scroll custom-scrollbar h-full">
        <div className="h-12 text-lg border-b-2 flex justify-between items-center px-6 py-8 font-semibold">
          Edit your profile
          <button
            type="button"
            className="text-xl transition-colors hover:text-red-600"
            onClick={closeEditDrawer}
          >
            <AiOutlineClose />
          </button>
        </div>
        <div className="mt-4 flex justify-center h-40">
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
          <div
            className="relative img-edit"
            onClick={() => setIsOpenModal(true)}
          >
            <img
              className="h-full rounded-full"
              src={`uploads/${auth?.urlProfileImage}`}
              alt="user-img"
            />
            <Button
              loading={loading}
              htmlType="button"
              className=" bg-dark-gray text-white border-none rounded-full h-10 w-10 p-2 absolute bottom-0 right-2 flex justify-center items-center"
            >
              <FiEdit className="text-xl" />
            </Button>
          </div>
        </div>
        <div style={{ height: 2 }} className="bg-neutral-700 mt-5"></div>
        <form className="mt-10 flex flex-col p-2 px-5 gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-lg font-bold">Edit email</span>
            <div className="relative pl-1">
              <label
                htmlFor="email"
                className={`text-base ${
                  form.email.error ? "text-red-600" : "text-neutral-500"
                } -top-1 left-4 absolute bg-neutral-900 px-2 h-2 flex items-center`}
              >
                Email
              </label>
              <input
                id="email"
                className={`outline-none  text-base bg-neutral-900 bg-opacity-50 border ${
                  form.email.error ? "border-red-600" : "border-neutral-600"
                }  rounded-md p-2 w-full`}
                type="text"
                value={form.email.value}
                onChange={(e) => onChangeInput(e.target.value, "email")}
              />
              {form.email.error ? (
                <div className="text-red-600">{form.email.error}</div>
              ) : null}
            </div>
          </div>
          <Button
            loading={loading}
            htmlType="button"
            onClick={updateEmail}
            className="text-base text-white border-none bg-primary p-1 rounded-lg w-1/2 m-auto"
          >
            Save
          </Button>
        </form>
        <form className="flex flex-col p-2 px-5 gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-lg font-bold">Edit password</span>
            <div className="relative pl-1 ">
              <label
                htmlFor="current-password"
                className={`text-base ${
                  form.currentPassword.error
                    ? "text-red-600"
                    : "text-neutral-500"
                } -top-1 left-3 absolute bg-neutral  px-2 h-2 flex items-center`}
                style={{ backgroundColor: "Background" }}
              >
                Current Password
              </label>
              <input
                id="current-password"
                className={`outline-none  text-base bg-neutral-900 bg-opacity-50 border ${
                  form.currentPassword.error
                    ? "border-red-600"
                    : "border-neutral-600"
                } rounded-md p-2 w-full`}
                type="password"
                value={form.currentPassword.value}
                onChange={(e) =>
                  onChangeInput(e.target.value, "currentPassword")
                }
              />
              {form.currentPassword.error ? (
                <div className="text-red-600">{form.currentPassword.error}</div>
              ) : null}
            </div>
          </div>
          <div className="relative pl-1 ">
            <label
              htmlFor="new-password"
              className={`text-base ${
                form.newPassword.error ? "text-red-600" : "text-neutral-500"
              } -top-1 left-3 absolute bg-neutral  px-2 h-2 flex items-center`}
              style={{ backgroundColor: "Background" }}
            >
              New password
            </label>
            <input
              id="new-password"
              className={`outline-none  text-base bg-neutral-900 bg-opacity-50 border ${
                form.newPassword.error ? "border-red-600" : "border-neutral-600"
              }  rounded-md p-2 w-full`}
              type="password"
              value={form.newPassword.value}
              onChange={(e) => onChangeInput(e.target.value, "newPassword")}
            />
            {form.newPassword.error ? (
              <div className="text-red-600">{form.newPassword.error}</div>
            ) : null}
          </div>
          <div className="relative pl-1">
            <label
              htmlFor="confirm-password"
              className={`text-base ${
                form.confirmPassword.error ? "text-red-600" : "text-neutral-500"
              }  -top-1 left-3 absolute bg-neutral px-2 h-2 flex items-center`}
              style={{ backgroundColor: "Background" }}
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              className={`outline-none  text-base bg-neutral-900 bg-opacity-50 border ${
                form.confirmPassword.error
                  ? "border-red-600"
                  : "border-neutral-600"
              } rounded-md p-2 w-full`}
              type="password"
              value={form.confirmPassword.value}
              onChange={(e) => onChangeInput(e.target.value, "confirmPassword")}
            />
            {form.confirmPassword.error ? (
              <div className="text-red-600">{form.confirmPassword.error}</div>
            ) : null}
          </div>
          <Button
            loading={loading}
            htmlType="button"
            onClick={updatePassword}
            className="text-base text-white border-none bg-primary p-1 rounded-lg w-1/2 m-auto"
          >
            Save
          </Button>
        </form>
      </div>
    </Drawer>
  );
}

export default EditDrawer;
