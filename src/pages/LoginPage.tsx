import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import type { AuthLoginDto } from "../api/types";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  identifier: z.string().min(1, "Informe e-mail ou usuário"),
  password: z.string().min(1, "Informe a senha"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

    const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: AuthLoginDto) => login(data),
    onSuccess: (res) => {
        loginSuccess(res.token, res.user);
        navigate("/", { replace: true });
    }
    });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit((v) => mutate(v))}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-2xl font-semibold mb-4">Entrar</h1>

        <label className="block mb-2 text-sm">E-mail ou usuário</label>
        <input
          className="w-full border p-2 rounded mb-1"
          {...register("identifier")}
          placeholder="ex: joao@exemplo.com"
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
        />
        {errors.password && (
          <p className="text-red-600 text-sm mb-2">{errors.password.message}</p>
        )}

        {isError && (
          <p className="text-red-600 text-sm mb-2">Credenciais inválidas.</p>
        )}

        <button
        disabled={isPending}
        className="w-full mt-3 py-2 rounded bg-black text-white"
        >
        {isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
