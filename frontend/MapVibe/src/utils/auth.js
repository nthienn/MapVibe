export const hasRole = (user, role) => {
    return user?.roles?.some((userRole) => userRole.name === role);
};

export const canViewMenuItem = (item, user) => {
    if (item.requiresAuth && !user) {
        return false;
    }

    if (item.roles?.length > 0) {
        return item.roles.some((role) => hasRole(user, role));
    }

    return true;
};