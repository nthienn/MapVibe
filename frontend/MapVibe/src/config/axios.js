import axios from "axios";
import authService from "../services/authService";
import { getAccessToken, setAccessToken, removeAccessToken } from "../utils/token";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
})

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const token = getAccessToken();

                if (!token) {
                    return Promise.reject(error);
                }

                const result = await authService.refresh(token);

                setAccessToken(result.token);

                originalRequest.headers.Authorization = `Bearer ${result.token}`;

                return api(originalRequest);
            } catch (refreshError) {
                removeAccessToken();

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api