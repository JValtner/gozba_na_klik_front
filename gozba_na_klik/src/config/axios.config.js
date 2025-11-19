import axios from "axios";
import { baseUrl } from "./routeConfig";
import { getToken } from "../components/service/userService";

let AxiosConfig = axios.create({
  baseURL: baseUrl,
  // Prostor za dodatnu konfiguraciju
});

// Automatically attach token to every request
AxiosConfig.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosConfig;