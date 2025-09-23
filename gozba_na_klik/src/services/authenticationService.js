import AxiosConfig from '../config/axios.config.js';

const AUTH_RESOURCE = "api/users";

export const authenticationService = {
  login: async (username, password) => {
    try {
      const { data } = await AxiosConfig.post(`${AUTH_RESOURCE}/login`, {
        username,
        password
      });
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Greška prilikom prijave';
      return { success: false, message };
    }
  }
};