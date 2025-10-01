import axios from "axios";

let AxiosConfig = axios.create({
  baseURL: "http://localhost:5065",
  //http port na backend-u 50307 jv
  //http port na backend-u 5065
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