import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/meals";

export async function getMealsByRestaurantId(restaurantId) {
  const response = await AxiosConfig.get(`${RESOURCE}/restaurant/${restaurantId}`);
  return response.data;
}

export async function getMealById(id) {
  const response = await AxiosConfig.get(`${RESOURCE}/${id}`);
  return response.data;
}

export async function createMeal(userData) {
   const response = await AxiosConfig.post(RESOURCE, userData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
}

export async function updateMeal(id, userData) {
 
  const response = await AxiosConfig.put(`${RESOURCE}/${id}`, userData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
}

export async function deleteMeal(id) {
  const response = await AxiosConfig.delete(`${RESOURCE}/${id}`);
  return response.data;
}