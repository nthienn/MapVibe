import api from "../config/axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const administrativeService = {
    async getProvinces() {
        const response = await api.get(
            API_ENDPOINTS.ADMINISTRATIVE.PROVINCES
        );

        return response.data.result;
    },

    async getWards(provinceCode) {
        const response = await api.get(
            `${API_ENDPOINTS.ADMINISTRATIVE.PROVINCES}/${provinceCode}/wards`
        );

        return response.data.result;
    },
};

export default administrativeService;