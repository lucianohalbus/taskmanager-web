// src/pages/RegisterPage.tsx
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as apiRegister, login } from "../api/auth";
import type { RegisterDto, AuthLoginDto } from "../api/types";
import { useAuth } from "../auth/useAuth";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1, "Enter your name"),
  email: z.string().email("Invalid e-mail"),
  username: z.string().min(3, "Minimum 3 characters"),
  password: z.string().min(6, "Minimum 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const registerMut = useMutation({
    mutationFn: (dto: RegisterDto) => apiRegister(dto),
  });

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    try {
      await registerMut.mutateAsync(values);

      const creds: AuthLoginDto = {
        identifier: values.email,
        password: values.password,
      };
      const res = await login(creds);

      // save token/user and navigate to /
      loginSuccess(res.token, res.user);
      requestAnimationFrame(() => navigate("/", { replace: true }));
    } catch (e) {
      console.error(e);
    }
  };

  const apiMsg =
    (registerMut.error as any)?.response?.data?.title ??
    (registerMut.error as any)?.response?.data ??
    (registerMut.error as any)?.message ??
    null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Create Account</h1>

        <label className="block text-sm">Name</label>
        <input className="w-full border p-2 rounded mb-1" {...register("name")} />
        {errors.name && <p className="text-red-600 text-sm mb-2">{errors.name.message}</p>}

        <label className="block text-sm mt-2">E-mail</label>
        <input className="w-full border p-2 rounded mb-1" type="email" {...register("email")} />
        {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>}

        <label className="block text-sm mt-2">Username</label>
        <input className="w-full border p-2 rounded mb-1" {...register("username")} />
        {errors.username && <p className="text-red-600 text-sm mb-2">{errors.username.message}</p>}

        <label className="block text-sm mt-2">Password</label>
        <input className="w-full border p-2 rounded mb-1" type="password" {...register("password")} />
        {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password.message}</p>}

        {registerMut.isError && (
          <p className="text-red-600 text-sm mb-2">{apiMsg ?? "Failed to register."}</p>
        )}

        <button 
          type="submit"
          disabled={registerMut.isPending}
          className="w-full mt-3 py-2 rounded bg-black text-white disabled:opacity-60"
        >
          {registerMut.isPending ? "Creating..." : "Create Account"}
        </button>

        <p className="mt-3 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-black underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}