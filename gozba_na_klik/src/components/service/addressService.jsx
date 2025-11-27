import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/addresses";

export const getUserAddresses = async () => {
  const response = await AxiosConfig.get(`${RESOURCE}/my`);
  return response.data;
};

export const createAddress = async (addressData) => {
  const response = await AxiosConfig.post(RESOURCE, addressData);
  return response.data;
};

export const updateAddress = async (addressId, addressData) => {
  const response = await AxiosConfig.put(`${RESOURCE}/${addressId}`, addressData);
  return response.data;
};

export const deleteAddress = async (addressId) => {
  const response = await AxiosConfig.delete(`${RESOURCE}/${addressId}`);
  return response.data;
};

export const setDefaultAddress = async (addressId) => {
  const response = await AxiosConfig.put(`${RESOURCE}/${addressId}/default`, {});
  return response.data;
};