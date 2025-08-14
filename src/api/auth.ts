
import api from "./axios";
import type { AuthLoginDto, AuthResponse, RegisterDto, RegisterResponse } from "./types";

// AuthLoginDto sends { identifier, password }.
// Backend waits { Email, Password } -> map here.
export async function login(data: AuthLoginDto): Promise<AuthResponse> {
  const payload = {
    Email: data.identifier,   // ← sent the entered email
    Password: data.password,
  };
  const { data: res } = await api.post<AuthResponse>("/user/login", payload);
  return res;
}

export async function register(dto: RegisterDto): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/user/register", dto);
  return data;
}
