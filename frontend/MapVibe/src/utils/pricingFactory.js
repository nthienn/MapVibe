export const createPricingItem = () => ({
    clientId: crypto.randomUUID(),
    title: "",
    description: "",
    price: "",
});

export const createPricingCategory = () => ({
    clientId: crypto.randomUUID(),
    categoryTitle: "",
    items: [createPricingItem()],
});