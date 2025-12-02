import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/meals";
const RESOURCE_ORDERS = "/api/orders";

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

export const getSortedFilteredPagedMeals = async (filter, page = 1, pageSize = 5, sortType = "") => {
  try {
    const params = {
      page,
      pageSize,
      ...(sortType ? { sortType } : {}),
      Name: filter.Name || undefined,
      MinPrice: filter.MinPrice > 0 ? filter.MinPrice : undefined,
      MaxPrice: filter.MaxPrice > 0 ? filter.MaxPrice : undefined,
      RestaurantName: filter.RestaurantName || undefined,
      Alergens: filter.Alergens.length > 0 ? filter.Alergens : undefined,
      Addons: filter.Addons.length > 0 ? filter.Addons : undefined
    };

    const response = await AxiosConfig.get(`${RESOURCE}/filterSortPage`, { params });
    return response.data; // { items, count, hasNextPage, hasPreviousPage, totalPages }
  } catch (error) {
    console.error(error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to fetch meals");
  }
};

export const getTop5Meals = async () => {
  try {
    const response = await AxiosConfig.get(`${RESOURCE_ORDERS}/most-popular`);
    const top5Ids = response.data; 
    console.log("Top 5 meal IDs:", top5Ids);

    const mealsTop5 = await Promise.all(top5Ids.map(id => getMealById(id)));

    return mealsTop5; 
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch top 5 meals");
  }
};



export const getSortTypes = async () => {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/sortTypes`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch sort types");
  }
};

