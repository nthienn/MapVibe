import api from "../config/axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const categoryService = {
    async getCategories() {
        const response = await api.get(
            API_ENDPOINTS.CATEGORIES
        );

        return response.data.result;
    },

    async getAdminCategories(params) {
        const response = await api.get(
            `${API_ENDPOINTS.CATEGORIES}/admin`,
            { params },
        );

        return response.data.result;
    },

    async createCategory(data) {
        const response = await api.post(
            API_ENDPOINTS.CATEGORIES,
            data,
        );

        return response.data.result;
    },

    async updateCategory(id, data) {
        const response = await api.put(
            `${API_ENDPOINTS.CATEGORIES}/${id}`,
            data,
        );

        return response.data.result;
    },

    async deleteCategory(id) {
        const response = await api.delete(
            `${API_ENDPOINTS.CATEGORIES}/${id}`,
        );

        return response.data.result;
    },
};

export default categoryService;