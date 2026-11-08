const createClientId = (prefix) => {
    return `${prefix}-${crypto.randomUUID()}`;
};

const mapPricingCategories = (categories = []) => {
    return categories.map((category) => ({
        id: category.id,
        clientId: createClientId("pricing-category"),
        categoryTitle: category.categoryTitle,
        items: (category.items || []).map((item) => ({
            id: item.id,
            clientId: createClientId("pricing-item"),
            title: item.title,
            description: item.description || "",
            price: item.price,
        })),
    }));
};

const mapPricingItems = (items = []) => {
    return items.map((item) => ({
        id: item.id,
        clientId: createClientId("pricing-item"),
        title: item.title,
        description: item.description || "",
        price: item.price,
    }));
};

const mapPricingOrder = (
    pricingOrder = [],
    pricingCategories = [],
    pricingItems = [],
) => {
    return pricingOrder
        .map((block) => {
            if (block.type === "category") {
                const category = pricingCategories.find(
                    (category) => category.id === block.id,
                );

                if (!category) {
                    return null;
                }

                return {
                    type: "category",
                    id: category.clientId,
                };
            }

            if (block.type === "item") {
                const item = pricingItems.find((item) => item.id === block.id);

                if (!item) {
                    return null;
                }

                return {
                    type: "item",
                    id: item.clientId,
                };
            }

            return null;
        })
        .filter(Boolean);
};

export const mapLocationToFormData = (location = {}) => {
    const pricingItems = mapPricingItems(location.pricingItems || []);

    const pricingCategories = mapPricingCategories(
        location.pricingCategories || [],
    );

    const pricingOrder = mapPricingOrder(
        location.pricingOrder || [],
        pricingCategories,
        pricingItems,
    );

    return {
        name: location.name || "",
        categoryId: location.category?.id ?? "",
        provinceCode: location.province?.code ?? "",
        wardCode: location.ward?.code ?? "",
        address: location.address || "",
        latitude: location.latitude ?? null,
        longitude: location.longitude ?? null,
        description: location.description || "",
        phone: location.phone || "",
        website: location.website || "",
        email: location.email || "",
        facebook: location.facebook || "",
        instagram: location.instagram || "",
        tiktok: location.tiktok || "",
        images: location.images || [],
        amenityIds: location.amenities?.map((amenity) => amenity.id) || [],
        openingHours: location.openingHours || [],
        pricingItems,
        pricingCategories,
        pricingOrder,
    };
};