import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "@views/error";
import { uiRoutes } from "@components/header/uiRoutes";
import { Songs } from "@views/songs";
import { Favorites } from "@views/favorites";
import { Slideshow } from "@components/slideshow";
import { Authentication } from "@components/authentication";
import { Admin } from "@views/admin";
import { UserProvider } from "@context/user";
import { HelmetProvider } from "react-helmet-async";
import { Seo } from "@components/seo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: uiRoutes.songs,
        element: (
          <Fragment>
            <Seo
              indexPage={true}
              title="Songs"
              description="Explore our Christian Haitian song library! Choose a song from our collection, view it, email it, download it, and even present it!"
              canonicalPathname={uiRoutes.songs}
            />
            <Songs />
          </Fragment>
        ),
      },
      {
        path: uiRoutes.favorites,
        element: (
          <Fragment>
            <Seo
              indexPage={true}
              title="Favorites"
              description="Access your favorite songs in a click! Select a song from your list of favorites and enjoy viewing, emailing, downloading, and presenting it."
              canonicalPathname={uiRoutes.songs}
            />
            <Authentication pageName="your favorite songs">
              <Favorites />
            </Authentication>
          </Fragment>
        ),
      },
      {
        path: uiRoutes.admin,
        element: (
          <Fragment>
            <Seo
              indexPage={false}
              title="Admin"
              description="A central location of JayCloud services for day to day operations. Access your information in one place!"
              canonicalPathname={uiRoutes.songs}
            />
            <Authentication>
              <Admin />
            </Authentication>
          </Fragment>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
      <Slideshow />
    </HelmetProvider>
  </React.StrictMode>
);
