import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/orders";

export async function getActiveOrderByCourier(userId) {
  const response = await AxiosConfig.get(
    `${RESOURCE}/courier/${userId}/active-pickup`
  );
  return response.data;
}

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

export async function updateOrderToInDelivery(orderId) {
  const response = await AxiosConfig.put(
    `${RESOURCE}/${orderId}/status/to-in-delivery`
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

export async function updateOrderToDelivered(orderId) {
  const response = await AxiosConfig.put(
    `${RESOURCE}/${orderId}/status/to-delivered`
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

export async function getUserOrderHistory(userId, statusFilter = null, page = 1, pageSize = 10) {
  try {
    const params = {
      page,
      pageSize
    };

    if (statusFilter) {
      params.statusFilter = statusFilter;
    }

    const response = await AxiosConfig.get(`${RESOURCE}/user/${userId}`, {
      params,
      headers: {
        "X-User-Id": userId
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user order history:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Nemate dozvolu da vidite ove porudžbine');
    } else if (error.response?.status === 404) {
      throw new Error('Korisnik nije pronađen');
    } else {
      throw new Error('Greška pri učitavanju istorije porudžbina');
    }
  }
}

export async function getUserOrderById(orderId, userId) {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/${orderId}`, {
      headers: {
        "X-User-Id": userId
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user order:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Nemate dozvolu da vidite ovu porudžbinu');
    } else if (error.response?.status === 404) {
      throw new Error('Porudžbina nije pronađena');
    } else {
      throw new Error('Greška pri učitavanju porudžbine');
    }
  }
}
