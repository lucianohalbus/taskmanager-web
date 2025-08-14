import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProtectedShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  );
}
