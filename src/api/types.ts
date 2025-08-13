// ---------- Auth ----------
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

// ---------- Tasks ----------
export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string; // ISO 8601 (ex.: "2025-08-13T12:34:56Z")
  updatedAt?: string; // ISO 8601
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  completed?: boolean; 
}

export type UpdateTaskDto = Partial<CreateTaskDto>;

export type ApiProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
};

export function isProblemDetails(x: unknown): x is ApiProblemDetails {
  return !!x && typeof x === "object" &&
    ("title" in (x as any) || "status" in (x as any) || "errors" in (x as any));
}

