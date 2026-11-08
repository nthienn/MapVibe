import api from "../config/axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const mapVinaService = {
    async searchCoordinates({ address, ward, province }) {
        const response = await api.post(
            API_ENDPOINTS.MAPVINA.SEARCH,
            {
                address,
                ward,
                province
            }
        );

        return response.data.result;
    }
};

export default mapVinaService;