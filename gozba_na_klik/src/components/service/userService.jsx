import AxiosConfig from "../../config/axios.config";

const RESOURCE = "/api/users";

export async function getAllUsers() {
    const response = await AxiosConfig.get(RESOURCE);
    return response.data;
}

export async function getUserById(id) {
    const response = await AxiosConfig.get(`${RESOURCE}/${id}`);
    return response.data;
}

export async function createUser(userData) {
    const response = await AxiosConfig.post(RESOURCE, userData);
    return response.data;
}

export async function updateUser(id, userData) {
    const userkWithId = { ...userData, id: parseInt(id) };
    const response = await AxiosConfig.put(`${RESOURCE}/${id}`, userkWithId);
    return response.data;
}

export async function deleteUser(id) {
    const response = await AxiosConfig.delete(`${RESOURCE}/${id}`);
    return response.data;
}
