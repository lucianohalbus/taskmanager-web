import axios from "axios";
import { triggerUnauthorized } from "../auth/authEvents";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ex.: https://localhost:7151/api/v2
});

/** Define/clean the header Authorization for all request */
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/** treat 401 globally */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // trigger the logout flow
      triggerUnauthorized();
    } else {
      // Feedback dev + log
      const data = error?.response?.data;
      const msg =
        data?.title ??
        data?.detail ??
        error?.message ??
        "Erro inesperado.";
      if (import.meta.env.DEV) {
        alert(msg);
      }
      console.error("[API ERROR]", status, msg, data);
    }

    return Promise.reject(error);
  }
);

export default api;
