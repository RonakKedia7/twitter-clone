import { useAuth } from "@clerk/expo";
import axios, { AxiosInstance } from "axios";

export const createApiClient = (
  getToken: () => Promise<string | null>,
): AxiosInstance => {
  const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();

    console.log("Token:", token);
    console.log("API URL:", config.baseURL, config.url);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();

  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, data: any) =>
    api.put("/users/profile", data),
};
