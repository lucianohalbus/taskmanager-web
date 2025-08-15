import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-layout min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900">
      {/* Texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(24rem 24rem at 20% 10%, white 1px, transparent 1px), radial-gradient(24rem 24rem at 80% 90%, white 1px, transparent 1px)",
          backgroundSize: "32rem 32rem",
        }}
      />

      {/* Content centered horizontally and aligned to the top */}
      <div className="w-full max-w-md mx-auto pt-12 px-4">
        <h1 className="text-4xl font-semibold tracking-tight text-black text-center whitespace-nowrap">
          Welcome to TaskManager
        </h1>
        <p className="mt-1 mb-12 text-black text-center">
          Organize tasks, track progress, and collaborate.
        </p>

        {/* Login card */}
        <div className="rounded-2xl border border-white/10 bg-white/95 p-6 shadow-xl backdrop-blur sm:p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center">
          Need help?{" "}
          <Link to="/support" className="underline underline-offset-4">
            Support
          </Link>
        </p>
      </div>
    </div>
  );
}



