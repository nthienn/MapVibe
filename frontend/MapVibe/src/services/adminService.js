import api from "../config/axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const notifyListingStatusChanged = () => {
    window.dispatchEvent(
        new Event("admin-listing-status-changed"),
    );
};

const adminService = {
    async getDashboard() {
        const response = await api.get(
            API_ENDPOINTS.ADMIN.DASHBOARD
        );

        return response.data.result;
    },

    async getListings(status, page = 1, size = 6) {
        const response = await api.get(
            API_ENDPOINTS.ADMIN.LISTINGS,
            {
                params: {
                    status,
                    page,
                    size,
                },
            },
        );

        return response.data.result;
    },

    async getListingStatusCounts() {
        const response = await api.get(
            `${API_ENDPOINTS.ADMIN.LISTINGS}/status-counts`
        );

        return response.data.result;
    },

    async getListing(id) {
        const response = await api.get(
            `${API_ENDPOINTS.ADMIN.LISTINGS}/${id}`,
        );

        return response.data.result;
    },

    async approveListing(id) {
        const response = await api.patch(
            `${API_ENDPOINTS.ADMIN.LISTINGS}/${id}/approve`,
        );

        notifyListingStatusChanged();

        return response.data.result;
    },

    async rejectListing(id) {
        const response = await api.patch(
            `${API_ENDPOINTS.ADMIN.LISTINGS}/${id}/reject`,
        );

        notifyListingStatusChanged();

        return response.data.result;
    },

    async deactivateListing(id) {
        const response = await api.patch(
            `${API_ENDPOINTS.ADMIN.LISTINGS}/${id}/deactivate`,
        );

        notifyListingStatusChanged();

        return response.data.result;
    },

    async reactivateListing(id) {
        const response = await api.patch(
            `${API_ENDPOINTS.ADMIN.LISTINGS}/${id}/reactivate`,
        );

        notifyListingStatusChanged();

        return response.data.result;
    },

    async getAllReviews(params) {
        const response = await api.get(
            API_ENDPOINTS.REVIEWS.ADMIN,
            { params },
        );

        return response.data.result;
    },

    async getUsers(params) {
        const response = await api.get(
            API_ENDPOINTS.ADMIN.USERS,
            { params },
        );

        return response.data.result;
    },

    async suspendUser(id) {
        const response = await api.patch(
            `${API_ENDPOINTS.ADMIN.USERS}/${id}/suspend`,
        );

        return response.data.result;
    },

    async reactivateUser(id) {
        const response = await api.patch(
            `${API_ENDPOINTS.ADMIN.USERS}/${id}/reactivate`,
        );

        return response.data.result;
    },

    async updateUserRoles(id, roles) {
        const response = await api.put(
            `${API_ENDPOINTS.ADMIN.USERS}/${id}/roles`,
            { roles },
        );

        return response.data.result;
    },
};

export default adminService;