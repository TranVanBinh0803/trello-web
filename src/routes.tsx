import { RouteObject } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import Board from "./pages/Boards/_id";

const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
];
const privateRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Board />,
      },
    ],
  },
];

export const routes = [...publicRoutes, ...privateRoutes];
