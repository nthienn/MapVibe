export const parseJwt = (token) => {
    if (!token) return null;

    try {
        const base64 = token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const payload = JSON.parse(atob(base64));

        return payload;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const isTokenExpired = (token) => {
    const payload = parseJwt(token);

    if (!payload?.exp) {
        return true;
    }

    return payload.exp * 1000 < Date.now();
};