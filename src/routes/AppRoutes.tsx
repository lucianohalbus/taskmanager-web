import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../auth/ProtectedRoute";
import TasksPage from "../pages/TasksPage"; // ⬅️ import tasks page

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <TasksPage /> }, // ⬅️ TasksPage as protected initial route
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> }, // optional: fallback
]);

