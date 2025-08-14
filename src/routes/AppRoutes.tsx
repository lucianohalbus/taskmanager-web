import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../auth/ProtectedRoute";
import TasksPage from "../pages/TasksPage";
import ProtectedShell from "../layouts/ProtectedShell";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedShell />, 
        children: [
          { index: true, element: <TasksPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
