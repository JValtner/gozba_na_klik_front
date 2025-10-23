import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/orders";

export async function getOrderPreview(restaurantId, userId, orderData) {
  const response = await AxiosConfig.post(
    `${RESOURCE}/preview/restaurant/${restaurantId}`,
    orderData,
    {
      headers: {
        "X-User-Id": userId,
      },
    }
  );
  return response.data;
}

export async function createOrder(restaurantId, userId, orderData) {
  const response = await AxiosConfig.post(
    `${RESOURCE}/restaurant/${restaurantId}`,
    orderData,
    {
      headers: {
        "X-User-Id": userId,
      },
    }
  );
  return response.data;
}

export async function getRestaurantOrders(restaurantId, userId, status = "") {
  const response = await AxiosConfig.get(
    `${RESOURCE}/restaurant/${restaurantId}`,
    {
      params: { status },
      headers: {
        "X-User-Id": userId,
      },
    }
  );
  return response.data;
}

export async function acceptOrder(orderId, userId, estimatedMinutes) {
  const response = await AxiosConfig.put(
    `${RESOURCE}/${orderId}/accept`,
    { estimatedPreparationMinutes: estimatedMinutes },
    {
      headers: {
        "X-User-Id": userId,
      },
    }
  );
  return response.data;
}

export async function cancelOrder(orderId, userId, reason) {
  const response = await AxiosConfig.put(
    `${RESOURCE}/${orderId}/cancel`,
    { reason },
    {
      headers: {
        "X-User-Id": userId,
      },
    }
  );
  return response.data;
}
