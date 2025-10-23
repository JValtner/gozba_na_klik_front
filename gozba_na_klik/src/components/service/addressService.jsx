import axios from "axios";
import { baseUrl } from "../../config/routeConfig";

const API_URL = `${baseUrl}/api/addresses`;

export const getUserAddresses = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId
    },
  });
  return response.data;
};

export const createAddress = async (userId, addressData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, addressData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId
    },
  });
  return response.data;
};

export const updateAddress = async (userId, addressId, addressData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/${addressId}`, addressData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId
    },
  });
  return response.data;
};

export const deleteAddress = async (userId, addressId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId
    },
  });
  return response.data;
};

export const setDefaultAddress = async (userId, addressId) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/${addressId}/default`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId
    },
  });
  return response.data;
};