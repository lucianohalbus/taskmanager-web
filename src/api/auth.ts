import api from "./axios";
import type { AuthLoginDto, AuthResponse } from "./types";

export async function login(input: AuthLoginDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", input);
  return data;
}
