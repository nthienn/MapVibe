import api from "../config/axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const roleService = {
    async getPermissions() {
        const response = await api.get(
            API_ENDPOINTS.PERMISSION,
        );

        return response.data.result;
    },

    async createPermission(data) {
        const response = await api.post(
            API_ENDPOINTS.PERMISSION,
            data
        );

        return response.data.result;
    },

    async updatePermission(permissionName, data) {
        const response = await api.put(
            `${API_ENDPOINTS.PERMISSION}/${encodeURIComponent(permissionName)}`,
            data
        );

        return response.data.result;
    },

    async deletePermission(permissionName) {
        const response = await api.delete(
            `${API_ENDPOINTS.PERMISSION}/${encodeURIComponent(permissionName)}`
        );

        return response.data.result;
    },
};

export default roleService;