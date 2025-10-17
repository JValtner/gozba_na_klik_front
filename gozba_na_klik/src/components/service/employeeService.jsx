import AxiosConfig from "../../config/axios.config";

// GET employees by restaurant
export const getEmployeesByRestaurant = async (restaurantId, ownerId) => {
  const response = await AxiosConfig.get(`/api/Employee/restaurant/${restaurantId}`, {
    headers: { "X-User-Id": ownerId }
  });
  return response.data;
};

// POST register new employee
export const registerEmployee = async (restaurantId, ownerId, data) => {
  const response = await AxiosConfig.post(`/api/Employee/restaurant/${restaurantId}`, data, {
    headers: { "X-User-Id": ownerId }
  });
  return response.data;
};

// PUT update employee
export const updateEmployee = async (employeeId, ownerId, data) => {
  const response = await AxiosConfig.put(`/api/Employee/${employeeId}`, data, {
    headers: { "X-User-Id": ownerId }
  });
  return response.data;
};

// PUT suspend employee
export const suspendEmployee = async (employeeId, ownerId) => {
  await AxiosConfig.put(`/api/Employee/${employeeId}/suspend`, null, {
    headers: { "X-User-Id": ownerId }
  });
};

// PUT activate employee
export const activateEmployee = async (employeeId, ownerId) => {
  await AxiosConfig.put(`/api/Employee/${employeeId}/activate`, null, {
    headers: { "X-User-Id": ownerId }
  });
};