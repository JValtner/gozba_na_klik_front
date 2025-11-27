import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/orders";

export async function getUserOrders(userId, statusFilter = "", page = 1, pageSize = 10) {
  const params = new URLSearchParams();
  if (statusFilter) params.append("statusFilter", statusFilter);
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());

  const response = await AxiosConfig.get(`${RESOURCE}/user/${userId}?${params}`);
  return response.data;
}

export async function getActiveOrderByCourier(userId) {
  try {
    const response = await AxiosConfig.get(
      `${RESOURCE}/courier/${userId}/active-pickup`,
      {
        validateStatus: function (status) {
          // Tretiraj 200, 204 NoContent i 404 kao uspešne odgovore
          // 404 znači da nema aktivne porudžbine, što je normalno stanje
          return (
            (status >= 200 && status < 300) || status === 204 || status === 404
          );
        },
      }
    );
    // 204 NoContent ili 404 znači da nema aktivne porudžbine
    if (response.status === 204 || response.status === 404 || !response.data) {
      return null;
    }
    return response.data;
  } catch (error) {
    // Ako axios ipak baci grešku, tretiraj 404 kao "nema aktivne porudžbine"
    if (error.response?.status === 404 || error.response?.status === 204) {
      return null;
    }
    throw error;
  }
}

export async function getOrderPreview(restaurantId, orderData) {
  const response = await AxiosConfig.post(
    `${RESOURCE}/preview/restaurant/${restaurantId}`,
    orderData
  );
  return response.data;
}

export async function createOrder(restaurantId, orderData) {
  const response = await AxiosConfig.post(
    `${RESOURCE}/restaurant/${restaurantId}`,
    orderData
  );
  return response.data;
}

export async function getRestaurantOrders(restaurantId, status = "") {
  const response = await AxiosConfig.get(
    `${RESOURCE}/restaurant/${restaurantId}`,
    {
      params: { status },
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

export async function acceptOrder(orderId, estimatedMinutes) {
  const response = await AxiosConfig.put(`${RESOURCE}/${orderId}/accept`, {
    estimatedPreparationMinutes: estimatedMinutes,
  });
  return response.data;
}

export async function updateOrderToDelivered(orderId) {
  const response = await AxiosConfig.put(
    `${RESOURCE}/${orderId}/status/to-delivered`
  );
  return response.data;
}

export async function cancelOrder(orderId, reason) {
  const response = await AxiosConfig.put(`${RESOURCE}/${orderId}/cancel`, {
    reason,
  });
  return response.data;
}

export async function getActiveOrderStatus() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found");
  }

  const response = await AxiosConfig.get(`${RESOURCE}/user/my-active-order`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getUserOrderHistory(
  userId,
  statusFilter = null,
  page = 1,
  pageSize = 10
) {
  try {
    const params = {
      page,
      pageSize,
    };

    if (statusFilter) {
      params.statusFilter = statusFilter;
    }

    const response = await AxiosConfig.get(`${RESOURCE}/user/${userId}`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user order history:", error);

    if (error.response?.status === 401) {
      throw new Error("Nemate dozvolu da vidite ove porudžbine");
    } else if (error.response?.status === 404) {
      throw new Error("Korisnik nije pronađen");
    } else {
      throw new Error("Greška pri učitavanju istorije porudžbina");
    }
  }
}

export async function getUserOrderById(orderId) {
  try {
    const response = await AxiosConfig.get(`${RESOURCE}/${orderId}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching user order:", error);

    if (error.response?.status === 401) {
      throw new Error("Nemate dozvolu da vidite ovu porudžbinu");
    } else if (error.response?.status === 404) {
      throw new Error("Porudžbina nije pronađena");
    } else {
      throw new Error("Greška pri učitavanju porudžbine");
    }
  }
}
