import axios from "axios";

export const NEXT_PUBLIC_SERVER_URL = "http://localhost:3001/api/v1";
//export const NEXT_PUBLIC_SERVER_URL = "https://ignite-server-production.up.railway.app/api/v1";

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
    // Don't automatically redirect on 401 - let individual components handle it
    return Promise.reject(error);
  }
);

export default api;
