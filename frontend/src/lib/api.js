import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token ?? null;
};

export const api = axios.create({
  baseURL,
  timeout: 1000 * 10,
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export const fetcher = (url, params) =>
  api.get(url, { params }).then((res) => res.data);

export default api;
