import api from "../config/axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const reviewService = {
    async getReviews(locationId, params) {
        const response = await api.get(
            API_ENDPOINTS.REVIEWS.LOCATION(locationId),
            { params }
        );

        return response.data.result;
    },

    async getMyReviews(params) {
        const response = await api.get(
            API_ENDPOINTS.REVIEWS.MY_REVIEWS,
            { params },
        );

        return response.data.result;
    },

    async createReview(locationId, data) {
        const response = await api.post(
            API_ENDPOINTS.REVIEWS.LOCATION(locationId),
            data
        );

        return response.data.result;
    },

    async updateReview(locationId, reviewId, data) {
        const response = await api.put(
            `${API_ENDPOINTS.REVIEWS.LOCATION(locationId)}/${reviewId}`,
            data
        );

        return response.data.result;
    },

    async deleteReview(locationId, reviewId) {
        const response = await api.delete(
            `${API_ENDPOINTS.REVIEWS.LOCATION(locationId)}/${reviewId}`
        );

        return response.data;
    },
};

export default reviewService;