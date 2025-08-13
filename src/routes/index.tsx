import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import TasksPage from "../pages/TasksPage"; // placeholder por enquanto

export const router = createBrowserRouter([
  // Login público
  { path: "/login", element: <LoginPage /> },

  // Área autenticada
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      // Página inicial protegida (Tasks)
      { index: true, element: <TasksPage /> },
    ],
  },

  // Rota coringa → envia para home (protegida)
  { path: "*", element: <Navigate to="/" replace /> },
]);
