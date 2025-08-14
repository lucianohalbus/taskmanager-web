import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../api/auth";
import type { AuthLoginDto } from "../api/types";
import { useAuth } from "../auth/useAuth";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  identifier: z.string().min(1, "Informe o e-mail"),
  password: z.string().min(1, "Informe a senha"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const loginMut = useMutation({
    mutationFn: (data: AuthLoginDto) => login(data),
    onSuccess: (res) => {
      loginSuccess(res.token, res.user);
      // navega no próximo frame para evitar corrida com a ProtectedRoute
      requestAnimationFrame(() => navigate("/", { replace: true }));
    },
  });

  const onSubmit = (values: FormData) => {
    // Dispara o POST /user/login com { identifier, password }
    loginMut.mutate(values);
  };

  const apiMsg =
    (loginMut.error as any)?.response?.data?.title ??
    (loginMut.error as any)?.response?.data ??
    (loginMut.error as any)?.message ??
    null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-2xl font-semibold mb-4">Entrar</h1>

        <label className="block mb-2 text-sm">E-mail</label>
        <input
          className="w-full border p-2 rounded mb-1"
          {...register("identifier")}
          placeholder="ex: joao@exemplo.com"
          autoComplete="username"
          autoFocus
        />
        {errors.identifier && (
          <p className="text-red-600 text-sm mb-2">{errors.identifier.message}</p>
        )}

        <label className="block mb-2 text-sm mt-2">Senha</label>
        <input
          type="password"
          className="w-full border p-2 rounded mb-1"
          {...register("password")}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mb-2">{errors.password.message}</p>
        )}

        {loginMut.isError && (
          <p className="text-red-600 text-sm mb-2">
            {apiMsg ?? "Credenciais inválidas."}
          </p>
        )}

        <button
          type="submit"                 // ⬅️ explícito
          disabled={loginMut.isPending}
          className="w-full mt-3 py-2 rounded bg-black text-white disabled:opacity-60"
        >
          {loginMut.isPending ? "Entrando..." : "Entrar"}
        </button>

        <p className="mt-3 text-sm text-gray-600">
          Não tem conta?{" "}
          <Link to="/register" className="text-black underline">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}
