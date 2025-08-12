export type AuthLoginDto = { identifier: string; password: string };

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  username: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
