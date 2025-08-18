import axios from "axios";
import { triggerUnauthorized } from "../auth/authEvents";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ex.: https://localhost:7151/api/v2
});

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

const isAuthEndpoint = (url?: string) =>
  !!url &&
  (/\/user\/login/i.test(url) ||
    /\/user\/register/i.test(url) ||
    /\/auth\/login/i.test(url));

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isCancel?.(error)) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    const url = error?.config?.url as string | undefined;

    if (status === 401 && !isAuthEndpoint(url)) {
      triggerUnauthorized();
      return Promise.reject(error);
    }

    if (import.meta.env.DEV) {
      console.error("[API ERROR]", status, url, error?.response?.data ?? error?.message);
    }
    return Promise.reject(error);
  }
);

export default api;

