import api from "../config/axios";
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const bookmarkService = {
    async toggleBookmark(locationId) {
        const response = await api.post(
            `${API_ENDPOINTS.BOOKMARKS.TOGGLE}/${locationId}`
        );

        return response.data.result;
    },

    async getMyBookmarks(params) {
        const response = await api.get(
            `${API_ENDPOINTS.BOOKMARKS.MY_BOOKMARKS}`,
            { params }
        );

        return response.data.result;
    },
};

export default bookmarkService;