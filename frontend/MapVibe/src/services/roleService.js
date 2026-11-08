import api from "../config/axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const roleService = {
    async getRoles() {
        const response = await api.get(
            API_ENDPOINTS.ROLE,
        );

        return response.data.result;
    },

    async createRole(data) {
        const response = await api.post(
            API_ENDPOINTS.ROLE,
            data
        );

        return response.data.result;
    },

    async updateRole(roleName, data) {
        const response = await api.put(
            `${API_ENDPOINTS.ROLE}/${encodeURIComponent(roleName)}`,
            data
        );

        return response.data.result;
    },

    async deleteRole(roleName) {
        const response = await api.delete(
            `${API_ENDPOINTS.ROLE}/${encodeURIComponent(roleName)}`
        );

        return response.data.result;
    },
};

export default roleService;