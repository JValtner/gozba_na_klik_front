import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/users";

export async function getAllUsers() {
  const response = await AxiosConfig.get(RESOURCE);
  return response.data;
}

export async function getAllRestaurantOwners() {
  const response = await AxiosConfig.get(`${RESOURCE}/restaurant-owners`);
  return response.data;
}

export async function getUserById(id) {
  const response = await AxiosConfig.get(`${RESOURCE}/${id}`);
  return response.data;
}

export async function getUserAlergensById(id) {
  const response = await AxiosConfig.get(`${RESOURCE}/${id}/alergens`);
  return response.data;
}

export async function createUser(userData) {
  const response = await AxiosConfig.post(RESOURCE, userData);
  return response.data;
}

export async function updateUser(id, userData) {
  const response = await AxiosConfig.put(`${RESOURCE}/${id}`, userData);
  return response.data;
}

// ADMIN UPDATE USER ROLE
export async function updateUserRoleByAdmin(id, userData) {
  const response = await AxiosConfig.put(
    `${RESOURCE}/${id}/admin-users`,
    userData
  );
  return response.data;
}

// USER UPDATE USER ALERGENS
export async function UpdateUserAlergens(id, alergensIds) {
  const response = await AxiosConfig.put(`${RESOURCE}/${id}/alergens`, {
    AlergensIds: alergensIds.alergens,
  });
  return response.data;
}

export async function deleteUser(id) {
  const response = await AxiosConfig.delete(`${RESOURCE}/${id}`);
  return response.data;
}
