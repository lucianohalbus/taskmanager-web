import axios from "axios";
import { triggerUnauthorized } from "../auth/authEvents";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ex.: https://localhost:7151/api/v2
});

/** Define/limpa o Authorization para TODAS as requests */
export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

/** Endpoints de auth: não queremos redirecionar neles */
const isAuthEndpoint = (url?: string) =>
  !!url &&
  (/\/user\/login/i.test(url) ||
    /\/user\/register/i.test(url) ||
    /\/auth\/login/i.test(url));

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // 1) Cancels (React Query navegação/invalidations)
    if (axios.isCancel?.(error)) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    const url = error?.config?.url as string | undefined;

    // 2) 401 global -> logout + redirect (via Bridge), except in auth endpoints
    if (status === 401 && !isAuthEndpoint(url)) {
      triggerUnauthorized();
      return Promise.reject(error);
    }

    // 3) Only in dev logs
    if (import.meta.env.DEV) {
      console.error("[API ERROR]", status, url, error?.response?.data ?? error?.message);
    }
    return Promise.reject(error);
  }
);

export default api;

