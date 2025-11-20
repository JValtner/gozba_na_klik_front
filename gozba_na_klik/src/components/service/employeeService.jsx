import AxiosConfig from "../../config/axios.config";

// GET employees by restaurant
export const getEmployeesByRestaurant = async (restaurantId) => {
  const response = await AxiosConfig.get(`/api/Employee/restaurant/${restaurantId}`);
  return response.data;
};

// POST register new employee
export const registerEmployee = async (restaurantId, data) => {
  const response = await AxiosConfig.post(`/api/Employee/restaurant/${restaurantId}`, data);
  return response.data;
};

// PUT update employee
export const updateEmployee = async (employeeId, data) => {
  const response = await AxiosConfig.put(`/api/Employee/${employeeId}`, data);
  return response.data;
};

// PUT suspend employee
export const suspendEmployee = async (employeeId) => {
  await AxiosConfig.put(`/api/Employee/${employeeId}/suspend`, null);
};

// PUT activate employee
export const activateEmployee = async (employeeId) => {
  await AxiosConfig.put(`/api/Employee/${employeeId}/activate`, null);
};