import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { IsLoggedIn, MainPath } from "./pages/MainPath/MainPath";
import { ChatProvider } from "./contexts/ChatContext";
import { App } from "antd";

function MyPage() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPath />,
    },
    {
      path: "/sign-up",
      element: <IsLoggedIn />,
    },
  ]);
  return (
    <AuthProvider>
      <ChatProvider>
        <RouterProvider router={router} />
      </ChatProvider>
    </AuthProvider>
  );
}

const Apps = () => (
  <App className="text-white">
    <MyPage />
  </App>
);

export default Apps;
