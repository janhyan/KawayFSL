import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Practice from "./pages/Practice.jsx";
import UserAuth from "./pages/UserAuth.jsx";
import UserForgotPassword from "./pages/UserForgetPassword.jsx";
import Modules from "./pages/Modules.jsx";
import { AuthProvider } from "./auth/authContext.jsx";
import Lessons from "./pages/Lessons.jsx";
import Content from "./pages/Content.jsx";
import Assessment from "./pages/Assessment.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home key={1} />,
  },
  {
    path: "/practice",
    element: <Practice key={2} />,
  },
  {
    path: "/signin",
    element: <UserAuth key={3} />,
  },
  {
    path:"/forget-password",
    element: <UserForgotPassword key={4} />
  },
  {
    path:"/modules",
    element: <Modules key={5} />
  },
  {
    path:"/lessons",
    element: <Lessons key={6} />
  },
  {
    path:"/lesson-content",
    element: <Content key={7} />
  },
  {
    path:"/assessment",
    element: <Assessment key={8} />
  }
]);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
