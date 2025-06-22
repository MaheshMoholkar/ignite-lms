import axios from "axios";

export const DEV = "http://localhost:3001/api/v1";
export const NEXT_PUBLIC_SERVER_URL =
  "https://ignite-server-production.up.railway.app/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
