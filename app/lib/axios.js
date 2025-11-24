import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 20000,
});

// Request interceptor: añade Authorization si hay token en localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // no-op
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: devuelve response.data y normaliza errores
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const payload = error?.response?.data || {};
    const message = payload?.error || payload?.message || error?.message || "Error de red";
    const status = error?.response?.status;
    const wrapped = new Error(message);
    if (status) {
      wrapped.status = status;
    }
    wrapped.data = payload;
    return Promise.reject(wrapped);
  }
);

// Helper para setear/quitar token en tiempo de ejecución (opcional)
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
