export const buildSearchParams = ({
    keyword,
    category,
    location,
    locationId,
    radius,
    amenityIds = [],
    page,
    sort,
}) => {
    const params = new URLSearchParams();

    if (keyword?.trim()) {
        params.set("keyword", keyword.trim());
    }

    if (category?.slug) {
        params.set("category", category.slug);
    }

    if (location?.trim()) {
        params.set("location", location.trim());
    }

    if (locationId !== null && locationId !== undefined) {
        params.set("locationId", locationId);

        if (radius !== null && radius !== undefined) {
            params.set("radius", radius);
        }
    }

    amenityIds.forEach((id) => {
        if (id !== null && id !== undefined) {
            params.append("amenityIds", id);
        }
    });

    if (page && page > 1) {
        params.set("page", page);
    }

    if (sort) {
        params.set("sort", sort);
    }

    return params;
};

const getNumericParam = (searchParams, name) => {
    const value = searchParams.get(name);

    if (value === null || value === "") {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
};

const getNumericParams = (searchParams, name) => {
    return searchParams
        .getAll(name)
        .map(Number)
        .filter(Number.isFinite);
};

export const getSearchParams = (searchParams) => ({
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category") || null,
    location: searchParams.get("location") || "",
    locationId: getNumericParam(searchParams, "locationId"),
    radius: getNumericParam(searchParams, "radius"),
    amenityIds: getNumericParams(searchParams, "amenityIds"),
    page: Number(searchParams.get("page")) || 1,
    sort: searchParams.get("sort") || null,
});