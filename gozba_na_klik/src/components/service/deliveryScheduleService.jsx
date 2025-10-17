import AxiosConfig from "../../config/axios.config";

// GET
export const getDeliverySchedule = async (deliveryPersonId) => {
  const response = await AxiosConfig.get(`/api/delivery-persons/${deliveryPersonId}/schedule`);
  return response.data;
};

// POST
export const createDeliverySchedule = async (deliveryPersonId, scheduleData) => {
  const response = await AxiosConfig.post(
    `/api/delivery-persons/${deliveryPersonId}/schedule`,
    scheduleData
  );
  return response.data;
};

// PUT
export const updateDeliverySchedule = async (deliveryPersonId, scheduleId, scheduleData) => {
  const response = await AxiosConfig.put(
    `/api/delivery-persons/${deliveryPersonId}/schedule/${scheduleId}`,
    scheduleData
  );
  return response.data;
};

// DELETE
export const deleteDeliverySchedule = async (deliveryPersonId, scheduleId) => {
  const response = await AxiosConfig.delete(
    `/api/delivery-persons/${deliveryPersonId}/schedule/${scheduleId}`
  );
  return response.data;
};