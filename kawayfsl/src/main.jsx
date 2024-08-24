import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import "./App";
import Home from "./pages/Home.jsx";
import Practice from './pages/Practice.jsx'

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home key={1}/>,
  },
  {
    path: '/practice',
    element: <Practice key={2} />
      // <UnmountCallback onUnmount={}>
      //   <Practice />
      // </UnmountCallback>
      
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
