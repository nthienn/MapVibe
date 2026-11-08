import api from "../config/axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const locationService = {
    async getLocations(params) {
        const response = await api.get(
            API_ENDPOINTS.LISTINGS,
            { params }
        );

        return response.data.result;
    },

    async getLocationSuggestions(keyword, size = 8) {
        const response = await api.get(
            `${API_ENDPOINTS.LISTINGS}/suggestions`,
            {
                params: {
                    keyword,
                    size,
                },
            }
        );

        return response.data.result;
    },

    async getLocationDetail(slug) {
        const response = await api.get(
            `${API_ENDPOINTS.LISTINGS}/${slug}`
        );

        return response.data.result;
    },

    async getLocationById(id) {
        const response = await api.get(
            `${API_ENDPOINTS.LISTINGS}/id/${id}`
        );

        return response.data.result;
    },

    async getMyListings({ page = 1, size = 6, status } = {}) {
        const params = { page, size };

        if (status) {
            params.status = status;
        }

        const response = await api.get(
            API_ENDPOINTS.MY_LISTINGS,
            { params }
        );

        return response.data.result;
    },

    async createLocation(data) {
        const response = await api.post(
            API_ENDPOINTS.LISTINGS,
            data
        );

        return response.data.result;
    },

    async updateLocation(id, data) {
        const response = await api.put(
            `${API_ENDPOINTS.LISTINGS}/${id}`,
            data
        );

        return response.data.result;
    },

    async deleteLocation(id) {
        const response = await api.delete(
            `${API_ENDPOINTS.LISTINGS}/${id}`,
        );

        return response.data.result;
    },
};

export default locationService;