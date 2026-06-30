export const API_ROOT =
  import.meta.env.VITE_API_ROOT || "http://localhost:8017/v1";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  API_ROOT.replace(/\/v1\/?$/, "");
