import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/Reporting"; 

export const getProfitSummaryReport = async (searchData) => {
  const response = await AxiosConfig.get(`${RESOURCE}/profit-report`, { params: searchData });
  return response.data;
};

export const getMealSalesReport = async (searchData) => {
  const response = await AxiosConfig.get(`${RESOURCE}/meal-sales-report`, { params: searchData });
  return response.data;
};

export const getOrdersReport = async (searchData) => {
  const response = await AxiosConfig.get(`${RESOURCE}/orders-report`, { params: searchData });
  return response.data;
};

export const getMonthlyReport = async (restaurantId) => {
  const response = await AxiosConfig.get(`${RESOURCE}/full-monthly-report`, { params: { restaurantId } });
  return response.data;
};
export const setPeriod = (days, setStartDate, setEndDate) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  setStartDate(start.toISOString());
  setEndDate(end.toISOString());
};
