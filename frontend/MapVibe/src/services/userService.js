import api from "../config/axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const userService = {
    async getMyInfo() {
        const response = await api.get(API_ENDPOINTS.USERS.MY_PROFILE);
        return response.data.result;
    },

    async updateMyProfile(data) {
        const response = await api.put(
            API_ENDPOINTS.USERS.UPDATE_MY_PROFILE,
            data
        );
        return response.data.result;
    },

    async changePassword(data) {
        const response = await api.put(
            API_ENDPOINTS.USERS.CHANGE_PASSWORD,
            data
        );
        return response.data.result;
    },

    async getUserProfile(userId, params = {}) {
        const response = await api.get(
            API_ENDPOINTS.USERS.PROFILE(userId),
            { params },
        );

        return response.data.result;
    },
};

export default userService;