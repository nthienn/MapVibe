export const DAYS_OF_WEEK = [
    { dayOfWeek: 1, name: "Monday" },
    { dayOfWeek: 2, name: "Tuesday" },
    { dayOfWeek: 3, name: "Wednesday" },
    { dayOfWeek: 4, name: "Thursday" },
    { dayOfWeek: 5, name: "Friday" },
    { dayOfWeek: 6, name: "Saturday" },
    { dayOfWeek: 7, name: "Sunday" },
];

export const createDefaultOpeningHours = () => {
    return DAYS_OF_WEEK.map(({ dayOfWeek }) => ({
        dayOfWeek,
        openTime: null,
        closeTime: null,
        isClosed: false,
    }));
}

export const getDayName = (dayOfWeek) => {
    return (
        DAYS_OF_WEEK.find(
            (day) => day.dayOfWeek === dayOfWeek,
        )?.name || ""
    );
}

export const getCurrentDayOfWeek = (date = new Date()) => {
    const day = date.getDay();

    // JavaScript: Sunday = 0
    // Backend: Monday = 1 ... Sunday = 7
    return day === 0 ? 7 : day;
};

export const formatOpeningHours = (day) => {
    if (!day) {
        return "";
    }

    if (day.isClosed) {
        return "Closed";
    }

    if (!day.openTime || !day.closeTime) {
        return "Not available";
    }

    return `${day.openTime.slice(0, 5)} - ${day.closeTime.slice(0, 5)}`;
};

export const getOpeningHoursForDay = (openingHours, dayOfWeek,) => {
    return (
        openingHours?.find(
            (day) => day.dayOfWeek === dayOfWeek,
        ) || null
    );
};

export const isLocationOpenNow = (openingHours, date = new Date()) => {
    if (!openingHours || openingHours.length === 0) {
        return null;
    }

    const dayOfWeek = getCurrentDayOfWeek(date);

    const today = getOpeningHoursForDay(openingHours, dayOfWeek);

    if (!today || today.isClosed) {
        return false;
    }

    if (!today.openTime || !today.closeTime) {
        return null;
    }

    const currentTime =
        `${String(date.getHours()).padStart(2, "0")}:` +
        `${String(date.getMinutes()).padStart(2, "0")}`;

    return (
        currentTime >= today.openTime &&
        currentTime < today.closeTime
    );
};

export const getOpeningStatus = (openingHours, date = new Date()) => {
    if (!openingHours || openingHours.length === 0) {
        return null;
    }

    const dayOfWeek = getCurrentDayOfWeek(date);

    const today = getOpeningHoursForDay(openingHours, dayOfWeek);

    if (!today || today.isClosed) {
        return false;
    }

    if (!today.openTime || !today.closeTime) {
        return null;
    }

    const currentMinutes = date.getHours() * 60 + date.getMinutes();

    const [openHour, openMinute] = today.openTime.split(":").map(Number);

    const [closeHour, closeMinute] = today.closeTime.split(":").map(Number);

    const openMinutes = openHour * 60 + openMinute;

    const closeMinutes = closeHour * 60 + closeMinute;

    // Opening hours within the same day
    // Example: 09:00 - 17:00
    if (openMinutes < closeMinutes) {
        return (
            currentMinutes >= openMinutes &&
            currentMinutes < closeMinutes
        );
    }

    // Opening hours crossing midnight
    // Example: 22:00 - 02:00
    if (openMinutes > closeMinutes) {
        return (
            currentMinutes >= openMinutes ||
            currentMinutes < closeMinutes
        );
    }

    return false;
};