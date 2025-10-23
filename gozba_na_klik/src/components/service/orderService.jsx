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
