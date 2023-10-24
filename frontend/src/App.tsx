import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignUp } from "./pages/Auth/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import { MainPath } from "./pages/MainPath/MainPath";
import { ChatProvider } from "./contexts/ChatContext";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPath />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
    {
      path: "/login",
      // element:<SignIn/>
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

export default App;
