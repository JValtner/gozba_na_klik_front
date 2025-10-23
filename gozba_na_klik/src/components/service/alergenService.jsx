import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/alergens";

// ✅ Get all allergens
export async function getAllAlergens() {
  const response = await AxiosConfig.get(RESOURCE);
  return response.data;
}

// Get all allergens (Id, Name)
export async function getAllBasicAlergens() {
  const response = await AxiosConfig.get(`${RESOURCE}/all`);
  return response.data;
}

// ✅ Get allergens for a specific meal
export async function getAlergensByMealId(mealId) {
  const response = await AxiosConfig.get(`${RESOURCE}/meal/${mealId}`);
  return response.data;
}

// ✅ Add allergen to a meal
export async function addAlergenToMeal(mealId, alergenId) {
  const response = await AxiosConfig.post(`${RESOURCE}/${mealId}/${alergenId}`);
  return response.data;
}

// ✅ Remove allergen from a meal
export async function removeAlergenFromMeal(mealId, alergenId) {
  const response = await AxiosConfig.delete(
    `${RESOURCE}/${mealId}/${alergenId}`
  );
  return response.data;
}
