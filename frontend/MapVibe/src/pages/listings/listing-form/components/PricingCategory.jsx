import { useSortable } from "@dnd-kit/react/sortable";
import PricingItem from "./PricingItem";

const PricingCategory = ({
  category,
  categoryIndex,
  orderIndex,
  errors,
  onCategoryChange,
  onRemoveCategory,
  onItemChange,
  onAddItem,
  onRemoveItem,
  readOnly = false,
}) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: category.clientId,
    index: orderIndex,
    group: "pricing-root",
    type: "pricing-block",
    accept: "pricing-block",
    disabled: readOnly,
  });

  return (
    <div
      ref={ref}
      className={`pricing-list-item pricing-submenu ${isDragging ? "is-dragging" : ""}`}
    >
      <div className="pricing-category">
        <div className="pricing-category-header">
          {/* Category */}
          <div ref={handleRef} className="fm-move">
            <i className="sl sl-icon-cursor-move"></i>
          </div>

          <div className="fm-input">
            <input
              type="text"
              placeholder="Category Title"
              value={category.categoryTitle}
              className={errors?.categoryTitle ? "input-error" : ""}
              onChange={(e) => onCategoryChange(categoryIndex, e.target.value)}
              disabled={readOnly}
            />

            {errors?.categoryTitle && (
              <div className="error-wrapper">
                <span className="field-error">{errors?.categoryTitle}</span>
              </div>
            )}
          </div>

          <div className="fm-close">
            <button
              className="delete"
              onClick={() => onRemoveCategory(categoryIndex)}
            >
              <i className="fa fa-remove"></i>
            </button>
          </div>
        </div>

        {/* Category Items */}
        <div className="pricing-category-items">
          {category.items?.map((item, itemIndex) => (
            <PricingItem
              key={item.clientId}
              item={item}
              index={itemIndex}
              sortIndex={itemIndex}
              group={category.clientId}
              type={`pricing-category-item-${category.clientId}`}
              errors={errors?.items?.[item.clientId] || {}}
              onChange={(index, field, value) =>
                onItemChange(categoryIndex, index, field, value)
              }
              onRemove={(index) => onRemoveItem(categoryIndex, index)}
              readOnly={readOnly}
            />
          ))}
        </div>

        {/* Add Item To Category */}
        {!readOnly && (
          <button
            type="button"
            className="button"
            onClick={() => onAddItem(categoryIndex)}
          >
            Add Item To Category
          </button>
        )}
      </div>
    </div>
  );
};

export default PricingCategory;
