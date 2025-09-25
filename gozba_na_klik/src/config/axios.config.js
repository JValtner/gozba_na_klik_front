import axios from "axios";

let AxiosConfig = axios.create({
  baseURL: "http://localhost:5065",
  //http port na backend-u 50307 jv
  //http port na backend-u 5065
  // Prostor za dodatnu konfiguraciju
});

export default AxiosConfig;
