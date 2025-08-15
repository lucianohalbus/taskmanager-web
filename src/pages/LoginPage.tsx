import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../api/auth";
import type { AuthLoginDto } from "../api/types";
import { useAuth } from "../auth/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useId, useState } from "react";

const schema = z.object({
  identifier: z.string().min(1, "Enter your email"),
  password: z.string().min(1, "Enter your password"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const formId = useId();
  const [show, setShow] = useState(false);

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const loginMut = useMutation({
    mutationFn: (data: AuthLoginDto) => login(data),
    onSuccess: (res) => {
      loginSuccess(res.token, res.user);
      requestAnimationFrame(() => navigate("/", { replace: true }));
    },
  });

  const onSubmit = (values: FormData) => loginMut.mutate(values);

  const apiMsg =
    (loginMut.error as any)?.response?.data?.title ??
    (loginMut.error as any)?.response?.data ??
    (loginMut.error as any)?.message ??
    null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate
          aria-describedby={apiMsg ? `${formId}-api-error` : undefined}>
      <div className="text-center">
        <p className="mt-1 text-sm text-zinc-600">Sign in to continue.</p>
      </div>

      {loginMut.isError && (
        <div id={`${formId}-api-error`}
             className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
             role="alert">
          {apiMsg ?? "Invalid credentials."}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {/* Email */}
        <div>
          <label htmlFor={`${formId}-identifier`} className="block text-sm font-medium text-zinc-800">
            Email
          </label>
          <input
            id={`${formId}-identifier`}
            type="email"
            className={[
              "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none transition",
              errors.identifier
                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100",
            ].join(" ")}
            placeholder="john@example.com"
            autoComplete="username"
            autoFocus
            aria-invalid={!!errors.identifier}
            aria-describedby={errors.identifier ? `${formId}-identifier-error` : undefined}
            {...register("identifier")}
          />
          {errors.identifier && (
            <p id={`${formId}-identifier-error`} className="mt-1 text-sm text-red-600">
              {errors.identifier.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor={`${formId}-password`} className="block text-sm font-medium text-zinc-800">
            Password
          </label>

          <div className="relative mt-1">
            <input
              id={`${formId}-password`}
              type={show ? "text" : "password"}
              className={[
                "w-full rounded-lg border bg-white px-3 py-2 pr-10 text-zinc-900 placeholder-zinc-400 outline-none transition",
                errors.password
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100",
              ].join(" ")}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? `${formId}-password-error` : undefined}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-500 hover:text-zinc-800"
              aria-label={show ? "Hide password" : "Show password"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                {show ? (
                  <>
                    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 12s3.5-7 10-7 10 7 10 7c-.84 1.34-2.05 2.86-3.65 4.05" stroke="currentColor" strokeWidth="1.5"/>
                  </>
                ) : (
                  <>
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  </>
                )}
              </svg>
            </button>
          </div>

          {errors.password && (
            <p id={`${formId}-password-error`} className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}

          <p className="mt-2 text-center text-xs">
            <Link to="/forgot-password" className="text-zinc-600 underline underline-offset-4 hover:text-zinc-900">
              Forgot password?
            </Link>
          </p>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-2 focus:ring-zinc-200" />
          <span className="text-sm text-zinc-700">Keep me signed in</span>
        </label>

        <button
          type="submit"
          disabled={loginMut.isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-white transition hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-300"
        >
          {loginMut.isPending && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.2" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" />
            </svg>
          )}
          {loginMut.isPending ? "Signing in..." : "Login"}
        </button>

        <p className="text-center text-sm text-zinc-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-zinc-900 underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500">
        By continuing, you agree to our{" "}
        <a className="underline underline-offset-4" href="/terms">Terms</a> and{" "}
        <a className="underline underline-offset-4" href="/privacy">Privacy Policy</a>.
      </p>
    </form>
  );
}
