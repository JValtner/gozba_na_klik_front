import AxiosConfig from "../../config/axios.config";

// GET restoran po ID-u
export async function getRestaurantById(id) {
  // Dodaj cache-busting parametar da se podaci uvek osveže
  const response = await AxiosConfig.get(`/api/restaurants/${id}`, {
    params: {
      _t: Date.now() // Dodaj timestamp da spreči keširanje
    }
  });
  return response.data;
}

// UPDATE restoran
export async function updateRestaurant(id, formData) {
  const response = await AxiosConfig.put(`/api/restaurants/${id}`, formData);
  return response.data;
}

// ADMIN UPDATE restoran
export async function updateRestaurantByAdmin(id, formData) {
  const response = await AxiosConfig.put(
    `/api/restaurants/${id}/admin-edit`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

// CREATE restoran
export async function createRestaurant(formData) {
  const response = await AxiosConfig.post("/api/restaurants", formData);
  return response.data;
}

// GET svi restorani
export async function getAllRestaurants() {
  const response = await AxiosConfig.get("/api/restaurants");
  return response.data;
}
// GET  withrestaurants sorting, filtering, and paging
export const getSortedFilteredPagedRestaurants = async (filter, page = 1, pageSize = 5, sortType = "") => {
  try {
    const params = {
      page,
      pageSize,
      sortType,
      ...filter 
    };

    // Remove null or undefined filter fields
    Object.keys(params).forEach(
      (key) => (params[key] == null || params[key] === "") && delete params[key]
    );

    const response = await AxiosConfig.get(`/api/restaurants/filterSortPage`, { params });
    return response.data; // { items, count, hasNextPage, hasPreviousPage, totalPages }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch restaurants");
  }
};

// GET sort types
export const getSortTypes = async () => {
  try {
    const response = await AxiosConfig.get(`/api/restaurants/sortTypes`);
    return response.data; // return the array directly
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch sort types");
  }
};

// GET moji restorani
export async function getMyRestaurants() {
  const response = await AxiosConfig.get(`/api/restaurants/my`);
  return response.data;
}

// DELETE restoran
export async function deleteRestaurant(id) {
  const response = await AxiosConfig.delete(`/api/restaurants/${id}`);
  return response.data;
}

// UPDATE work schedules
export async function updateWorkSchedules(restaurantId, schedules) {
  const response = await AxiosConfig.put(
    `/api/restaurants/${restaurantId}/workschedules`,
    schedules
  );
  return response.data;
}

// ADD closed date
export async function addClosedDate(restaurantId, closedDate) {
  const response = await AxiosConfig.post(
    `/api/restaurants/${restaurantId}/closeddates`,
    closedDate
  );
  return response.data;
}

// REMOVE closed date
export async function removeClosedDate(restaurantId, dateId) {
  const response = await AxiosConfig.delete(
    `/api/restaurants/${restaurantId}/closeddates/${dateId}`
  );
  return response.data;
}

// GET nesavesni restorani (5+ otkazanih porudžbina u poslednjih 7 dana)
export async function getIrresponsibleRestaurants() {
  const response = await AxiosConfig.get("/api/restaurants/irresponsible");
  return response.data;
}

// POST suspenduj restoran
export async function suspendRestaurant(restaurantId, reason) {
  const response = await AxiosConfig.post(
    `/api/restaurants/${restaurantId}/suspend`,
    { reason }
  );
  return response.data;
}

export async function getRestaurantSuspension(restaurantId) {
  try {
    const response = await AxiosConfig.get(`/api/restaurants/${restaurantId}/suspension`);
    return response.data || null;
  } catch (error) {
    console.error(`Greška pri učitavanju suspenzije za restoran ${restaurantId}:`, error);
    return null;
  }
}

export async function appealSuspension(restaurantId, appealText) {
  const response = await AxiosConfig.post(
    `/api/restaurants/${restaurantId}/suspension/appeal`,
    { appealText }
  );
  return response.data;
}

export async function getAppealedSuspensions() {
  const response = await AxiosConfig.get("/api/restaurants/suspension-appeals");
  return response.data;
}

export async function processAppealDecision(restaurantId, accept) {
  const response = await AxiosConfig.patch(
    `/api/restaurants/${restaurantId}/suspension/decision`,
    { accept }
  );
  return response.data;
}