export const formatLocationAddress = (location) => {
    if (!location) {
        return "";
    }

    const parts = [
        location.address,
        location.ward?.name,
        location.province?.name,
    ]
        .map((part) => part?.trim())
        .filter(Boolean);

    return [...new Set(parts)].join(", ");
};