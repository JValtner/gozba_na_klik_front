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

// Admin functions
export async function getAllComplaintsLast30Days(page = 1, pageSize = 10) {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/admin/all`, {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    throw error;
  }
}

export async function getComplaintById(complaintId) {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/admin/${complaintId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching complaint by ID:", error);
    throw error;
  }
}

