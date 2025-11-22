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
    
    // Automatski postavi Content-Type: application/json samo ako nije FormData
    // FormData automatski postavlja multipart/form-data
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosConfig;