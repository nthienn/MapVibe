import api from "../config/axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const mediaService = {
    async uploadImage(file) {
        const formData = new FormData();

        formData.append("file", file);

        const response = await api.post(
            API_ENDPOINTS.MEDIA.UPLOAD,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.result;
    },

    async deleteImage(imageUrl) {
        await api.delete(
            API_ENDPOINTS.MEDIA.DELETE,
            {
                params: {
                    imageUrl,
                },
            },
        );
    },
};

export default mediaService;