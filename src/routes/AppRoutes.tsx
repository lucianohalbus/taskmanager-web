import { createBrowserRouter, Navigate } from "react-router-dom";
import AppRoot from "../layouts/AppRoot";
import ProtectedRoute from "../auth/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import TasksPage from "../pages/TasksPage";
import ProtectedShell from "../layouts/ProtectedShell";
import RegisterPage from "../pages/RegisterPage";
import AuthLayout from "../layouts/AuthLayout"; // ⬅️ novo

export const router = createBrowserRouter([
  {
    element: <AppRoot />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
        ],
      },

      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            element: <ProtectedShell />,
            children: [{ index: true, element: <TasksPage /> }],
          },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
