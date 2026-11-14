import axios from "axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const authApi = axios.create({
    baseURL: "http://localhost:8080/api"
});

const authService = {
    async login(credentials) {
        const response = await authApi.post(
            `${API_ENDPOINTS.AUTH.LOGIN}`,
            credentials
        );

        return response.data.result;
    },

    async register(data) {
        const response = await authApi.post(
            API_ENDPOINTS.AUTH.REGISTER,
            data
        );

        return response.data.result;
    },

    async logout(token) {
        const response = await authApi.post(
            `${API_ENDPOINTS.AUTH.LOGOUT}`,
            token
        );

        return response.data.result;
    },

    async refresh(token) {
        const response = await authApi.post(
            `${API_ENDPOINTS.AUTH.REFRESH}`,
            { token }
        );

        return response.data.result;
    },

    async verifyEmail(token) {
        const response = await authApi.post(
            `${API_ENDPOINTS.AUTH.VERIFY_EMAIL}`,
            { token }
        );

        return response.data.result;
    },

    async resendVerificationEmail(email) {
        const response = await authApi.post(
            `${API_ENDPOINTS.AUTH.RESEND_VERIFICATION}`,
            { email }
        );

        return response.data.result;
    },
};

export default authService;