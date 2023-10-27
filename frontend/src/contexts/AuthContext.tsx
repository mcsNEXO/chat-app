import React from "react";
import Cookies from "js-cookie";
import { apiClient } from "../axios";
import { App } from "antd";

interface IAuthContext {
  auth: UserContext | null;
  setAuth: (user: UserContext | null) => void;
  logout: () => void;
}

export type UserContext = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  refreshToken?: string;
  accessToken?: string;
  urlProfileImage: string;
};

export const AuthContext = React.createContext<IAuthContext>(null as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuthState] = React.useState<UserContext | null>(null);
  const { message } = App.useApp();

  React.useEffect(() => {
    (async () => {
      const data = Cookies.get("auth");
      if (!data) return;
      try {
        setAuth(JSON.parse(data));
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const setAuth = (user: UserContext | null) => {
    setAuthState(user);
    Cookies.set("auth", JSON.stringify(user), {
      secure: true,
      expires: 21,
      sameSite: "none",
    });
  };

  const logout = async () => {
    setAuth(null);
    try {
      const res = await apiClient.sendRequest({
        method: "get",
        url: "auth/logout",
      });
      if (res.status === 200) {
        message.success("You have been loggout");
      }
      location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const value = {
    auth,
    setAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
