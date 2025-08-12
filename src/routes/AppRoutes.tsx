import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../auth/ProtectedRoute";

// placeholder da Home protegida
function Home() {
  return <h1 className="p-6 text-2xl">Logado! 🚀</h1>;
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [{ index: true, element: <Home /> }]
  },
]);
