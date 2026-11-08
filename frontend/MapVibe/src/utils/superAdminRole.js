import { getAccessToken } from "./token";

export const hasSuperAdminRole = () => {
    try {
        const token = getAccessToken();

        if (!token) {
            return false;
        }

        const payloadPart = token.split(".")[1];

        if (!payloadPart) {
            return false;
        }

        const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");

        const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

        const payload = JSON.parse(window.atob(paddedBase64));

        const scope = payload.scope ?? payload.authorities ?? payload.roles ?? [];

        const authorities = Array.isArray(scope)
            ? scope
            : String(scope).split(/\s+/);

        return (
            authorities.includes("ROLE_SUPER_ADMIN") ||
            authorities.includes("SUPER_ADMIN")
        );
    } catch {
        return false;
    }
};