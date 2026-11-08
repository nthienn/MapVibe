export const API_ENDPOINTS = {
    HOME: "/home/init",

    LISTINGS: "/locations",

    MY_LISTINGS: "/locations/my-listings",

    CATEGORIES: "/categories",

    AMENITY: "/amenities",

    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        REFRESH: "/auth/refresh",
        LOGOUT: "/auth/logout",
    },

    USERS: {
        MY_PROFILE: "/users/my-profile",
        UPDATE_MY_PROFILE: "/users/my-profile",
        CHANGE_PASSWORD: "/users/change-password",
        PROFILE: (id) => `/users/${id}/profile`,
    },

    MEDIA: {
        UPLOAD: "/media/upload",
        DELETE: "/media",
    },

    BOOKMARKS: {
        TOGGLE: "/bookmarks/toggle",
        MY_BOOKMARKS: "/bookmarks",
    },

    REVIEWS: {
        LOCATION: (locationId) => `/locations/${locationId}/reviews`,
        ADMIN: "/reviews/admin",
        MY_REVIEWS: "/reviews/my-reviews"
    },

    ADMINISTRATIVE: {
        PROVINCES: "/provinces",
    },

    MAPVINA: {
        SEARCH: "/mapvina/search",
    },

    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        LISTINGS: "/admin/listings",
        USERS: "/admin/users",
    },

    ROLE: "/roles",

    PERMISSION: "/permissions"
};