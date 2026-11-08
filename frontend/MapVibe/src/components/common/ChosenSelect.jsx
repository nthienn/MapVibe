import { useEffect, useRef, useState } from "react";

const ChosenSelect = ({
  options = [],
  value = null,
  onChange,
  placeholder = "Select Item",
  error = false,
  valueKey = "id",
  labelKey = "name",
  disabled = false,
  hidePlaceholderOption = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedValue, setHighlightedValue] = useState(null);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((option) => option?.[valueKey] === value);

  const selectedText = selectedOption ? selectedOption[labelKey] : placeholder;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setHighlightedValue(selectedOption?.[valueKey] ?? null);
  }, [isOpen, value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <div
      ref={wrapperRef}
      className={`
        chosen-container
        chosen-container-single
        chosen-container-single-nosearch
        ${isOpen ? "chosen-container-active chosen-with-drop" : ""}
        ${disabled ? "chosen-disabled" : ""}
        ${error ? "input-error" : ""}
      `}
      style={{ width: "100%" }}
    >
      <a
        className="chosen-single chosen-default"
        aria-disabled={disabled}
        onClick={() => {
          if (disabled) return;

          setIsOpen((prev) => !prev);
        }}
      >
        <span>{selectedText}</span>

        <div>
          <b></b>
        </div>
      </a>

      <div className="chosen-drop">
        <ul className="chosen-results">
          {!hidePlaceholderOption && (
            <li
              className={`
                active-result
                ${!selectedOption ? "result-selected" : ""}
                ${highlightedValue === null ? "highlighted" : ""}
              `}
              onClick={handleClear}
              onMouseEnter={() => setHighlightedValue(null)}
              onMouseLeave={() => setHighlightedValue(null)}
            >
              {placeholder}
            </li>
          )}

          {options.map((option) => {
            const optionValue = option?.[valueKey];
            const isSelected = selectedOption?.[valueKey] === optionValue;
            const isHighlighted = highlightedValue === optionValue;

            return (
              <li
                key={optionValue}
                className={`
                  active-result
                  ${isSelected ? "result-selected" : ""}
                  ${isHighlighted ? "highlighted" : ""}
                `}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedValue(optionValue)}
                onMouseLeave={() => setHighlightedValue(null)}
              >
                {option?.[labelKey]}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ChosenSelect;
