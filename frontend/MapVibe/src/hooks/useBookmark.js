import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import bookmarkService from "../services/bookmarkService";

const useBookmark = () => {
    const { isLoggedIn } = useAuth();

    const toggleBookmark = async (locationId, onSuccess) => {
        if (!isLoggedIn) {
            toast.info("Sign in to save your favorite places.");
            return;
        }

        try {
            const result = await bookmarkService.toggleBookmark(locationId);

            if (onSuccess) {
                onSuccess(result);
            }

            return result;
        } catch (error) {
            console.error(error);
            toast.error("Unable to update bookmark.");
        }
    };

    return {
        toggleBookmark,
    };
};

export default useBookmark;