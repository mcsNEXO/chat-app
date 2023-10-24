import { useAuth } from "../../contexts/AuthContext";
import { ChatPage } from "../ChatPage/ChatPage";
import { Main } from "../Main/Main";

export const MainPath = () => {
  const { auth } = useAuth();
  return auth ? <ChatPage /> : <Main />;
};
