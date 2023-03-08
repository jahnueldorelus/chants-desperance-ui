import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "@views/error";
import { uiRoutes } from "@components/header/uiRoutes";
import { Songs } from "@views/songs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: uiRoutes.songs,
        element: <Songs />,
      },
      {
        path: uiRoutes.favorites,
        element: <></>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
