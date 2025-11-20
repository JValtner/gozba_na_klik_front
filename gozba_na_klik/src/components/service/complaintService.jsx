import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/complaints";

export async function createComplaint(orderId, message) {
  const response = await AxiosConfig.post(RESOURCE, {
    orderId,
    message
  });
  return response.data;
}

export async function checkComplaintExists(orderId) {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/order/${orderId}/exists`);
    return response.data.exists;
  } catch (error) {
    console.error("Error checking complaint existence:", error);
    return false;
  }
}

export async function getRestaurantComplaints() {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/restaurant/my`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant complaints:", error);
    throw error;
  }
}

export async function getComplaintByOrderId(orderId) {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/order/${orderId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching complaint:", error);
    throw error;
  }
}

