import axios from "axios";
import { baseUrl } from "./routeConfig";

let AxiosConfig = axios.create({
  baseURL: baseUrl,
  // Prostor za dodatnu konfiguraciju
});

// Interceptor koji automatski dodaje X-User-Id, jer je tako na backu implementirano
AxiosConfig.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosConfig;