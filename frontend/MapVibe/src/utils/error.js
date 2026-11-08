export const getApiErrorMessage = (error, fallback = "Something went wrong.") => {
    const response = error.response?.data;

    return (
        response?.errors?.[0]?.message ||
        response?.message ||
        error.message ||
        fallback
    );
};