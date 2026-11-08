import { useEffect, useState } from "react";

const CheckboxFilter = ({
  options = [],
  value,
  onApply,
  onClose,
  multiple = false,
  valueKey = "id",
  labelKey = "name",
  allLabel = "All",
}) => {
  const [draftValue, setDraftValue] = useState(
    multiple ? value || [] : value || null,
  );

  useEffect(() => {
    setDraftValue(multiple ? value || [] : value || null);
  }, [value, multiple]);

  const handleCancel = () => {
    setDraftValue(multiple ? value || [] : value || null);
    onClose();
  };

  const handleApply = () => {
    onApply(draftValue);
    onClose();
  };

  const isSelected = (option) => {
    const optionValue = option[valueKey];

    if (multiple) {
      return draftValue.some((item) => item[valueKey] === optionValue);
    }

    return draftValue?.[valueKey] === optionValue;
  };

  const handleChange = (option) => {
    if (!multiple) {
      if (isSelected(option)) {
        setDraftValue(null);
      } else {
        setDraftValue(option);
      }

      return;
    }

    setDraftValue((current) => {
      const exists = current.some(
        (item) => item[valueKey] === option[valueKey],
      );

      if (exists) {
        return current.filter((item) => item[valueKey] !== option[valueKey]);
      }

      return [...current, option];
    });
  };

  const handleAllChange = () => {
    if (multiple) {
      setDraftValue([]);
    } else {
      setDraftValue(null);
    }
  };

  const middle = Math.ceil(options.length / 2);
  const left = options.slice(0, middle);
  const right = options.slice(middle);

  const renderOption = (option) => {
    const optionId = option[valueKey];
    const selected = isSelected(option);

    return (
      <div key={optionId}>
        <input
          id={`${multiple ? "option" : "filter"}-${optionId}`}
          type="checkbox"
          checked={selected}
          onChange={() => handleChange(option)}
        />

        <label htmlFor={`${multiple ? "option" : "filter"}-${optionId}`}>
          {option[labelKey]}
        </label>
      </div>
    );
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div>
            <input
              id={`filter-all-${multiple ? "multiple" : "single"}`}
              type="checkbox"
              checked={multiple ? draftValue.length === 0 : !draftValue}
              onChange={handleAllChange}
            />

            <label htmlFor={`filter-all-${multiple ? "multiple" : "single"}`}>
              {allLabel}
            </label>
          </div>

          {left.map(renderOption)}
        </div>

        <div className="col-md-6">{right.map(renderOption)}</div>
      </div>

      <div className="panel-buttons">
        <button className="panel-cancel" onClick={handleCancel}>
          Cancel
        </button>

        <button className="panel-apply" onClick={handleApply}>
          Apply
        </button>
      </div>
    </>
  );
};

export default CheckboxFilter;
