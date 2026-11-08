import api from "../config/axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const amenityService = {
    async getAmenities() {
        const response = await api.get(
            API_ENDPOINTS.AMENITY
        );

        return response.data.result;
    },

    async getAdminAmenities(params) {
        const response = await api.get(
            `${API_ENDPOINTS.AMENITY}/admin`,
            { params }
        );

        return response.data.result;
    },

    async createAmenity(data) {
        const response = await api.post(
            API_ENDPOINTS.AMENITY,
            data
        );

        return response.data.result;
    },

    async updateAmenity(id, data) {
        const response = await api.put(
            `${API_ENDPOINTS.AMENITY}/${id}`,
            data
        );

        return response.data.result;
    },

    async deleteAmenity(id) {
        const response = await api.delete(
            `${API_ENDPOINTS.AMENITY}/${id}`
        );

        return response.data.result;
    },
};

export default amenityService;