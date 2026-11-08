export const menuConfig = [
    {
        id: "home",
        title: "Home",
        path: "/",
    },
    {
        id: "listings",
        title: "Listings",
        path: "/listings",
    },
    {
        id: "contact",
        title: "Contact",
        path: "/contact",
    },
    {
        id: "admin",
        title: "Admin",
        requiresAuth: true,
        roles: ["ADMIN"],
        children: [
            {
                id: "dashboard",
                title: "Dashboard",
                icon: "sl sl-icon-settings",
                path: "/admin"
            },
            {
                id: "icon",
                title: "Icon",
                icon: "sl sl-icon-diamond",
                path: "/icons",
            },
        ]
    }
];

export const adminMenuConfig = [
    {
        id: "home",
        title: "View Website",
        path: "/",
    },
    {
        id: "icon",
        title: "Icon",
        path: "/icons",
    },
    {
        id: "contact",
        title: "Contact",
        path: "/contact",
    },
];