import { RouteObject } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import Board from "./pages/Boards/_id";
import BoardsPage from "./pages/Boards";
import Test from "./pages/Test";

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
        path: "/boards/:boardId",
        element: <Board />,
      },
    ],
  },
];

export const routes = [...publicRoutes, ...privateRoutes];
