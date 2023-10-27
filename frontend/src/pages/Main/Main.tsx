import { NavLink } from "react-router-dom";
import mainSvg from "../../assets/main.svg";
import logoSvg from "../../assets/logo3.svg";
import "./Main.scss";
import { useState } from "react";
import { apiClient } from "../../axios";
import { UserContext, useAuth } from "../../contexts/AuthContext";
import "../../App.css";
import { App } from "antd";

export const Main = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { message } = App.useApp();

  const { setAuth } = useAuth();

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await apiClient.sendRequest({
        url: "auth/login",
        method: "post",
        data: {
          email,
          password,
        },
      });
      const data: any = res.data;
      if (res.status === 200 && data.success === true) {
        message.success("You logged in");
        setAuth(data.data as UserContext);
      }
    } catch (err: any) {
      message.error(
        `${
          err?.response?.data?.message
            ? `Error: ${err?.response?.data?.message}`
            : "Something went wrong"
        } `
      );
    }
  };

  return (
    <div className="container-main">
      <div className="nav-bar">
        <img src={logoSvg} alt="logo" />
        <div className="options">
          <NavLink to={"/contact"}>Conctact</NavLink>
          <NavLink to={"/sign-up"}>Sign up</NavLink>
        </div>
      </div>
      <div className="flex">
        <div className="left-side">
          <span className="text">Simple app to chat with friends</span>
          <br />
          <div className="description-text">
            Chattify is an innovative chat application that allows easy and fun
            connections between people around the world. With its unique
            interface and advanced features, Chattify transforms a standard text
            conversation into a dynamic communication experience.
          </div>
          <form onSubmit={signIn}>
            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-box">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="submit">
              Sign in
            </button>
          </form>
        </div>
        <div className="right-side">
          <img src={mainSvg} />
        </div>
      </div>
    </div>
  );
};
