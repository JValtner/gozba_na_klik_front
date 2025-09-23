import axios from 'axios';

let AxiosConfig = axios.create({
  baseURL: 'http://localhost:5065/',
  // Prostor za dodatnu konfiguraciju
});

export default AxiosConfig;