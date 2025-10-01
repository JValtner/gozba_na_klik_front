import AxiosConfig from "../../config/axios.config";

// GET restoran po ID-u
export async function getRestaurantById(id) {
  const response = await AxiosConfig.get(`/api/restaurants/${id}`);
  return response.data;
}

// UPDATE restoran
export async function updateRestaurant(id, formData) {
  const response = await AxiosConfig.put(`/api/restaurants/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
}

// CREATE restoran
export async function createRestaurant(formData) {
  const response = await AxiosConfig.post("/api/restaurants", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
}

// GET svi restorani
export async function getAllRestaurants() {
  const response = await AxiosConfig.get("/api/restaurants");
  return response.data;
}

// GET moji restorani
export async function getMyRestaurants() {
  const response = await AxiosConfig.get("/api/restaurants/my");
  return response.data;
}

// DELETE restoran
export async function deleteRestaurant(id) {
  const response = await AxiosConfig.delete(`/api/restaurants/${id}`);
  return response.data;
}

// UPDATE work schedules
export async function updateWorkSchedules(restaurantId, schedules) {
  const response = await AxiosConfig.put(`/api/restaurants/${restaurantId}/workschedules`, schedules);
  return response.data;
}

// ADD closed date
export async function addClosedDate(restaurantId, closedDate) {
  const response = await AxiosConfig.post(`/api/restaurants/${restaurantId}/closeddates`, closedDate);
  return response.data;
}

// REMOVE closed date
export async function removeClosedDate(restaurantId, dateId) {
  const response = await AxiosConfig.delete(`/api/restaurants/${restaurantId}/closeddates/${dateId}`);
  return response.data;
}