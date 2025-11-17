import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/users";
const TOKEN_KEY = "token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    AxiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  delete AxiosConfig.defaults.headers.common["Authorization"];
}

export async function login(data) {
  const res = await AxiosConfig.post(`${RESOURCE}/login`, data);

  const token = typeof res.data === "string" 
    ? res.data 
    : res.data.token || res.data.accessToken;

  if (token) {
    setToken(token);
  }

  return token;  // ✔ vrati token
}


export async function register(userdata) {
  const response = await AxiosConfig.post(`${RESOURCE}`, userdata);
  return response.data;
}

export async function getCurrentProfile() {
  const response = await AxiosConfig.get(`${RESOURCE}/profile`);
  return response.data;
}

export function getUserRolesFromToken(token) {
  if (!token) return [];
  const payload = JSON.parse(atob(token.split('.')[1]));
  // Use the correct claim type
  return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
      ? [payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']] 
      : [];
}

export function logout() {
  removeToken();
}

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
export async function UseStrong(length) 
{
  if(!length || length < 8) length = 10; // default length
  
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "!@#$%^&*()-_=+[]{};:,.<>?";

  // Ensure at least one of each required type
  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += special[Math.floor(Math.random() * special.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];

  // Fill the rest with a mix
  const allChars = lowercase + uppercase + numbers + special;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle to avoid predictable placement
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

  

