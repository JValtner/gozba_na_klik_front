import axios from 'axios';

let AxiosConfig = axios.create({
  baseURL: 'http://localhost:8351//',//Proveriti koji je port
  // Prostor za dodatnu konfiguraciju
});

export default AxiosConfig;