import axios from 'axios';

let AxiosConfig = axios.create({
  baseURL: 'http://localhost:5065',//http port na backend-u
  // Prostor za dodatnu konfiguraciju
});

export default AxiosConfig;