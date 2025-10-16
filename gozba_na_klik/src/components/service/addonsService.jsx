import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/mealaddons";

// ✅ Get addons for a specific meal
export async function getAddonsByMealId(mealId) {
  const response = await AxiosConfig.get(`${RESOURCE}/meal/${mealId}`);
  return response.data;
}

// ✅ Add/create addon for a meal
export async function addAddon(addon) {
  const response = await AxiosConfig.post(`${RESOURCE}`, addon);
  return response.data;
}

// ✅ Activate a chosen addon (only one can be active at a time)
export async function activateChosenAddon(addonId) {
  const response = await AxiosConfig.put(`/api/mealaddons/${addonId}/activate`);
  return response.data;
}

// ✅ Remove/delete addon from a meal
export async function removeAddon(addonId) {
  const response = await AxiosConfig.delete(`${RESOURCE}/${addonId}`);
  return response.data;
}
