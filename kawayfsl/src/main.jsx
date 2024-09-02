import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Practice from './pages/Practice.jsx'
import UserAuth from "./pages/UserAuth.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home key={1}/>,
  },
  {
    path: '/practice',
    element: <Practice key={2} />
  },
  {
    path: '/signin',
    element: <UserAuth key={3} />
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
