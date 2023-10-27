import { useAuth } from "../../contexts/AuthContext";
import SignUp from "../Auth/SignUp";
import { ChatPage } from "../ChatPage/ChatPage";
import { Main } from "../Main/Main";

export const MainPath = () => {
  const { auth } = useAuth();
  return auth ? <ChatPage /> : <Main />;
};

export const IsLoggedIn = () => {
  const { auth } = useAuth();
  return auth ? <ChatPage /> : <SignUp />;
};
