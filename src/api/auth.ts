import api from "./axios";
import type { AuthLoginDto, AuthResponse, RegisterDto, RegisterResponse } from "./types";

export async function login(data: AuthLoginDto): Promise<AuthResponse> {
  const payload = {
    identifier: data.identifier,
    password: data.password,
  };
  const { data: res } = await api.post<AuthResponse>("/auth/login", payload); // ✅ corrigido
  return res;
}

export async function register(dto: RegisterDto): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/user/register", dto);
  return data;
}
