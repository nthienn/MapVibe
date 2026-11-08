import { forwardRef, useImperativeHandle, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import {
  createPricingCategory,
  createPricingItem,
} from "../../../../utils/pricingFactory";
import PricingItem from "./PricingItem";
import PricingCategory from "./PricingCategory";

const ListingPricing = forwardRef(
  ({ formData, setFormData, readOnly = false }, ref) => {
    const [enabled, setEnabled] = useState(
      readOnly ||
        formData.pricingItems.length > 0 ||
        formData.pricingCategories.length > 0,
    );

    const [errors, setErrors] = useState({
      items: {},
      categories: {},
    });

    const handleToggle = (enabled) => {
      setEnabled(enabled);

      if (enabled) {
        const hasPricing =
          formData.pricingItems.length > 0 ||
          formData.pricingCategories.length > 0;

        if (!hasPricing) {
          const newItem = createPricingItem();

          setFormData((prev) => ({
            ...prev,
            pricingItems: [newItem],
            pricingCategories: [],
            pricingOrder: [
              {
                type: "item",
                id: newItem.clientId,
              },
            ],
          }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          pricingItems: [],
          pricingCategories: [],
          pricingOrder: [],
        }));

        setErrors({
          items: {},
          categories: {},
        });
      }
    };

    const handleItemChange = (index, field, value) => {
      setFormData((prev) => {
        const items = [...prev.pricingItems];

        items[index] = {
          ...items[index],
          [field]: value,
        };

        return {
          ...prev,
          pricingItems: items,
        };
      });

      setErrors((prev) => {
        const item = formData.pricingItems[index];

        if (!item?.clientId || !prev.items[item.clientId]?.[field]) {
          return prev;
        }

        const nextItems = { ...prev.items };
        const nextItemErrors = { ...nextItems[item.clientId] };

        delete nextItemErrors[field];

        if (Object.keys(nextItemErrors).length === 0) {
          delete nextItems[item.clientId];
        } else {
          nextItems[item.clientId] = nextItemErrors;
        }

        return {
          ...prev,
          items: nextItems,
        };
      });
    };

    const handleAddItem = () => {
      const newItem = createPricingItem();

      setFormData((prev) => ({
        ...prev,
        pricingItems: [...prev.pricingItems, newItem],
        pricingOrder: [
          ...prev.pricingOrder,
          {
            type: "item",
            id: newItem.clientId,
          },
        ],
      }));
    };

    const handleRemoveItem = (index) => {
      setFormData((prev) => {
        const item = prev.pricingItems[index];

        return {
          ...prev,
          pricingItems: prev.pricingItems.filter(
            (_, itemIndex) => itemIndex !== index,
          ),
          pricingOrder: prev.pricingOrder.filter(
            (block) => !(block.type === "item" && block.id === item.clientId),
          ),
        };
      });
    };

    const handleCategoryChange = (categoryIndex, value) => {
      setFormData((prev) => {
        const categories = [...prev.pricingCategories];

        categories[categoryIndex] = {
          ...categories[categoryIndex],
          categoryTitle: value,
        };

        return {
          ...prev,
          pricingCategories: categories,
        };
      });

      setErrors((prev) => {
        const category = formData.pricingCategories[categoryIndex];

        if (
          !category?.clientId ||
          !prev.categories[category.clientId]?.categoryTitle
        ) {
          return prev;
        }

        const nextCategories = { ...prev.categories };
        const nextCategoryErrors = { ...nextCategories[category.clientId] };

        delete nextCategoryErrors.categoryTitle;

        if (Object.keys(nextCategoryErrors.items || {}).length === 0) {
          delete nextCategoryErrors.items;
        }

        if (Object.keys(nextCategoryErrors).length === 0) {
          delete nextCategories[category.clientId];
        } else {
          nextCategories[category.clientId] = nextCategoryErrors;
        }

        return {
          ...prev,
          categories: nextCategories,
        };
      });
    };

    const handleAddCategory = () => {
      const newCategory = createPricingCategory();

      setFormData((prev) => ({
        ...prev,
        pricingCategories: [...prev.pricingCategories, newCategory],
        pricingOrder: [
          ...prev.pricingOrder,
          {
            type: "category",
            id: newCategory.clientId,
          },
        ],
      }));
    };

    const handleRemoveCategory = (categoryIndex) => {
      setFormData((prev) => {
        const category = prev.pricingCategories[categoryIndex];

        return {
          ...prev,
          pricingCategories: prev.pricingCategories.filter(
            (_, index) => index !== categoryIndex,
          ),
          pricingOrder: prev.pricingOrder.filter(
            (block) =>
              !(block.type === "category" && block.id === category.clientId),
          ),
        };
      });
    };

    const handleCategoryItemChange = (
      categoryIndex,
      itemIndex,
      field,
      value,
    ) => {
      setFormData((prev) => {
        const categories = [...prev.pricingCategories];
        const category = categories[categoryIndex];
        const items = [...category.items];

        items[itemIndex] = {
          ...items[itemIndex],
          [field]: value,
        };

        categories[categoryIndex] = {
          ...category,
          items,
        };

        return {
          ...prev,
          pricingCategories: categories,
        };
      });

      setErrors((prev) => {
        const category = formData.pricingCategories[categoryIndex];
        const item = category?.items?.[itemIndex];

        if (
          !item?.clientId ||
          !prev.categories[category?.clientId]?.items?.[item.clientId]?.[field]
        ) {
          return prev;
        }

        const nextCategories = { ...prev.categories };
        const nextCategoryErrors = { ...nextCategories[category.clientId] };
        const nextItemErrors = { ...nextCategoryErrors.items };
        const nextItemFieldErrors = { ...nextItemErrors[item.clientId] };

        delete nextItemFieldErrors[field];

        if (Object.keys(nextItemFieldErrors).length === 0) {
          delete nextItemErrors[item.clientId];
        } else {
          nextItemErrors[item.clientId] = nextItemFieldErrors;
        }

        nextCategoryErrors.items = nextItemErrors;

        if (
          !nextCategoryErrors.categoryTitle &&
          Object.keys(nextItemErrors).length === 0
        ) {
          delete nextCategories[category.clientId];
        } else {
          nextCategories[category.clientId] = nextCategoryErrors;
        }

        return {
          ...prev,
          categories: nextCategories,
        };
      });
    };

    const handleAddCategoryItem = (categoryIndex) => {
      setFormData((prev) => ({
        ...prev,
        pricingCategories: prev.pricingCategories.map((category, index) =>
          index === categoryIndex
            ? {
                ...category,
                items: [...(category.items || []), createPricingItem()],
              }
            : category,
        ),
      }));
    };

    const handleRemoveCategoryItem = (categoryIndex, itemIndex) => {
      setFormData((prev) => {
        const categories = [...prev.pricingCategories];
        const category = categories[categoryIndex];

        const updatedItems = category.items.filter(
          (_, index) => index !== itemIndex,
        );

        // If the category has no remaining items → delete the category.
        if (updatedItems.length === 0) {
          categories.splice(categoryIndex, 1);

          return {
            ...prev,
            pricingCategories: categories,
            pricingOrder: prev.pricingOrder.filter(
              (block) =>
                !(block.type === "category" && block.id === category.clientId),
            ),
          };
        }

        categories[categoryIndex] = {
          ...category,
          items: updatedItems,
        };

        return {
          ...prev,
          pricingCategories: categories,
        };
      });
    };

    const handleDragEng = (event) => {
      if (readOnly || event.canceled) {
        return;
      }

      if (event.canceled) {
        return;
      }

      const { source } = event.operation;

      if (!isSortable(source)) {
        return;
      }

      const { initialIndex, index, initialGroup, group } = source;

      if (initialGroup == null || group == null) {
        return;
      }

      // ROOT
      if (initialGroup === "pricing-root" && group === "pricing-root") {
        if (initialIndex === index) {
          return;
        }

        setFormData((prev) => {
          const pricingOrder = [...prev.pricingOrder];

          const [movedBlock] = pricingOrder.splice(initialIndex, 1);

          pricingOrder.splice(index, 0, movedBlock);

          return {
            ...prev,
            pricingOrder,
          };
        });

        return;
      }

      // CATEGORY ITEMS
      if (initialGroup === group && initialGroup !== "pricing-root") {
        if (initialIndex === index) {
          return;
        }

        const categoryClientId = initialGroup;

        setFormData((prev) => ({
          ...prev,

          pricingCategories: prev.pricingCategories.map((category) => {
            if (category.clientId !== categoryClientId) {
              return category;
            }

            const items = [...(category.items || [])];
            const [movedItem] = items.splice(initialIndex, 1);

            items.splice(index, 0, movedItem);

            return {
              ...category,
              items,
            };
          }),
        }));
      }
    };

    const getPricingBlock = (block) => {
      if (block.type === "item") {
        return formData.pricingItems.find((item) => item.clientId === block.id);
      }

      if (block.type === "category") {
        return formData.pricingCategories.find(
          (category) => category.clientId === block.id,
        );
      }

      return null;
    };

    const validate = () => {
      if (!enabled) {
        setErrors({
          items: {},
          categories: {},
        });

        return true;
      }

      const newErrors = {
        items: {},
        categories: {},
      };

      // Root Pricing Items
      formData.pricingItems.forEach((item) => {
        const itemErrors = {};

        if (!item.title?.trim()) {
          itemErrors.title = "This field is required.";
        }

        if (!item.price) {
          itemErrors.price = "This field is required.";
        }

        if (Object.keys(itemErrors).length > 0) {
          newErrors.items[item.clientId] = itemErrors;
        }
      });

      // Pricing Categories
      formData.pricingCategories.forEach((category) => {
        const categoryErrors = {
          items: {},
        };

        if (!category.categoryTitle?.trim()) {
          categoryErrors.categoryTitle = "This field is required.";
        }

        category.items?.forEach((item) => {
          const itemErrors = {};

          if (!item.title?.trim()) {
            itemErrors.title = "This field is required.";
          }

          if (!item.price) {
            itemErrors.price = "This field is required.";
          }

          if (Object.keys(itemErrors).length > 0) {
            categoryErrors.items[item.clientId] = itemErrors;
          }
        });

        if (
          categoryErrors.categoryTitle ||
          Object.keys(categoryErrors.items).length > 0
        ) {
          newErrors.categories[category.clientId] = categoryErrors;
        }
      });

      setErrors(newErrors);

      return (
        Object.keys(newErrors.items).length === 0 &&
        Object.keys(newErrors.categories).length === 0
      );
    };

    useImperativeHandle(ref, () => ({
      validate,
    }));

    return (
      <div
        className={`add-listing-section margin-top-45 ${enabled ? "switcher-on" : ""}`}
      >
        <div className="add-listing-headline">
          <h3>
            <i className="sl sl-icon-book-open"></i> Pricing
          </h3>

          <label className="switch">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggle(e.target.checked)}
              disabled={readOnly}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <DragDropProvider onDragEnd={handleDragEng}>
          <div className="switcher-content">
            <div className="row">
              <div className="col-md-12">
                <div
                  id="pricing-list-container"
                  className="pricing-list-container"
                >
                  {formData.pricingOrder.map((block, orderIndex) => {
                    const pricingBlock = getPricingBlock(block);

                    if (!pricingBlock) {
                      return null;
                    }

                    if (block.type === "item") {
                      return (
                        <PricingItem
                          key={pricingBlock.clientId}
                          item={pricingBlock}
                          index={formData.pricingItems.findIndex(
                            (item) => item.clientId === pricingBlock.clientId,
                          )}
                          sortIndex={orderIndex}
                          group="pricing-root"
                          type="pricing-block"
                          errors={errors.items[pricingBlock.clientId] || {}}
                          onChange={handleItemChange}
                          onRemove={handleRemoveItem}
                          readOnly={readOnly}
                        />
                      );
                    }

                    if (block.type === "category") {
                      return (
                        <PricingCategory
                          key={pricingBlock.clientId}
                          category={pricingBlock}
                          categoryIndex={formData.pricingCategories.findIndex(
                            (category) =>
                              category.clientId === pricingBlock.clientId,
                          )}
                          orderIndex={orderIndex}
                          errors={
                            errors.categories[pricingBlock.clientId] || {}
                          }
                          onCategoryChange={handleCategoryChange}
                          onRemoveCategory={handleRemoveCategory}
                          onItemChange={handleCategoryItemChange}
                          onAddItem={handleAddCategoryItem}
                          onRemoveItem={handleRemoveCategoryItem}
                          readOnly={readOnly}
                        />
                      );
                    }

                    return null;
                  })}
                </div>

                {!readOnly && (
                  <>
                    <button
                      type="button"
                      className="button add-pricing-list-item"
                      onClick={handleAddItem}
                    >
                      Add Item
                    </button>
                    <button
                      type="button"
                      className="button add-pricing-submenu"
                      onClick={handleAddCategory}
                    >
                      Add Category
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </DragDropProvider>
      </div>
    );
  },
);

export default ListingPricing;
