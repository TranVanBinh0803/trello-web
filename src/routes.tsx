import { RouteObject } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import Board from "./pages/Boards/_id";
import BoardsPage from "./pages/Boards";
import { NotFoundPage } from "./pages/Common/NotFoundPage";

const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/boards/:boardId",
    element: <Board />,
  },
  {
    path: "/*",
    element: <NotFoundPage />,
  },
];
const privateRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <BoardsPage />,
      },
      {
        path: "/boards",
        element: <BoardsPage />,
      },
      {
        path: "/*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export const routes = [...publicRoutes, ...privateRoutes];
