import { useSortable } from "@dnd-kit/react/sortable";

const PricingItem = ({
  item,
  index,
  sortIndex,
  group,
  type,
  errors,
  onChange,
  onRemove,
  readOnly = false,
}) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: item.clientId,
    index: sortIndex,
    group,
    type,
    accept: type,
    disabled: readOnly,
  });

  return (
    <div
      ref={ref}
      className={`pricing-list-item ${isDragging ? "is-dragging" : ""}`}
    >
      <div className="pricing-item">
        <div ref={handleRef} className="fm-move">
          <i className="sl sl-icon-cursor-move"></i>
        </div>

        <div className="fm-input pricing-name">
          <input
            type="text"
            placeholder="Title"
            value={item.title}
            className={errors?.title ? "input-error" : ""}
            onChange={(e) => onChange(index, "title", e.target.value)}
            disabled={readOnly}
          />

          {errors?.title && (
            <div className="error-wrapper">
              <span className="field-error">{errors?.title}</span>
            </div>
          )}
        </div>

        <div className="fm-input pricing-ingredients">
          <input
            type="text"
            placeholder="Description"
            value={item.description}
            onChange={(e) => onChange(index, "description", e.target.value)}
            disabled={readOnly}
          />
        </div>

        <div className="fm-input pricing-price">
          <i className="data-unit">VND</i>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Price"
            maxLength={9}
            value={item.price}
            className={errors?.price ? "input-error" : ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              onChange(index, "price", value);
            }}
            disabled={readOnly}
          />

          {errors?.price && (
            <div className="error-wrapper">
              <span className="field-error">{errors?.price}</span>
            </div>
          )}
        </div>

        <div className="fm-close">
          <button className="delete" onClick={() => onRemove(index)}>
            <i className="fa fa-remove"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingItem;
