import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/orders";

export async function getActiveOrderByCourier(userId) {
  const response = await AxiosConfig.get(
    `${RESOURCE}/courier/${userId}/active-pickup`
  );
  return response.data;
}

export async function updateOrderToInDelivery(orderId) {
  const response = await AxiosConfig.put(
    `${RESOURCE}/${orderId}/status/to-in-delivery`
  );
  return response.data;
}

export async function updateOrderToDelivered(orderId) {
  const response = await AxiosConfig.put(
    `${RESOURCE}/${orderId}/status/to-delivered`
  );
  return response.data;
}
