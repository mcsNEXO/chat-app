import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../axios";
import { ChatType, UserType } from "../types/userTypes";

export const useFetchRecipient = (chat: ChatType) => {
  const [recipientUser, setRecipientUser] = React.useState<UserType>(
    null as any
  );
  const { auth } = useAuth();
  const recipientId = chat?.members.find((id) => id !== auth?._id);

  React.useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;
      try {
        const res = await apiClient.sendRequest({
          method: "get",
          url: `users/findUserById/${recipientId}`,
        });
        const user = res.data as UserType;
        setRecipientUser(user);
      } catch (error) {
        throw new Error(error as any);
      }
    };
    getUser();
  }, []);
  return { recipientUser };
};
