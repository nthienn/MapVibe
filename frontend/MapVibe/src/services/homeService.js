import api from "../config/axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const homeService = {
    async getHomeData() {
        const response = await api.get(API_ENDPOINTS.HOME);
        return response.data.result;
    },
};

export default homeService;