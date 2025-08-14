import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onSignOut = () => {
    logout();                  
    navigate("/login", { replace: true }); 
  };

  return (
    <nav className="sticky top-0 z-10 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="text-base font-semibold">
            TaskManager
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium">{user?.name ?? "Usuário"}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <button
            onClick={onSignOut}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            aria-label="Sair"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
