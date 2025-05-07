import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/Home";
import { Layout } from "../internal/Layout";
import { Links } from "../constants/links";
import { RegisterPage } from "../pages/Register";
import { LoginPage } from "../pages/Login";
import { NotFoundPage } from "../pages/404";
import { ProfilePage } from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: Links.HOME,
    element: <Layout />,
    children: [
      {
        path: Links.HOME,
        element: <HomePage />,
      },
      {
        path: Links.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: Links.LOGIN,
        element: <LoginPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: Links.PROFILE,
        element: <ProfilePage />,
      }
    //   {
    //     path: `${Links.WEATHER}/:city`,
    //     element: <WeatherPage />,
    //   },
    //   {
    //     path: `${Links.WEATHER}`,
    //     element: <WeatherPage />,
    //   },
    //   {
    //     path: "*",
    //     element: <NotFoundPage />,
    //   },
    //   {
    //     path: `${Links.FAVOURITES}`,
    //     element: <FavouritesPage />,
    //   }
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};