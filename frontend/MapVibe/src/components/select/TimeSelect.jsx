import ChosenSelect from "../common/ChosenSelect";

const TIME_OPTIONS = Array.from({ length: 24 * 2 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";

  const value = `${String(hour).padStart(2, "0")}:${minute}`;

  return {
    value,
    label: value,
  };
});

const normalizeTimeValue = (value) => {
  if (!value) {
    return "";
  }

  if (value === "closed") {
    return "closed";
  }

  return value.slice(0, 5);
};

const TimeSelect = ({
  value,
  onChange,
  placeholder = "Opening Time",
  allowClosed = false,
  disabled = false,
  hasError = false,
}) => {
  const normalizedValue = normalizeTimeValue(value);

  const options = allowClosed
    ? [
        {
          value: "closed",
          label: "Closed",
        },
        ...TIME_OPTIONS,
      ]
    : TIME_OPTIONS;

  const handleChange = (option) => {
    onChange?.(option?.value ?? "");
  };

  return (
    <ChosenSelect
      options={options}
      value={normalizedValue || null}
      onChange={handleChange}
      placeholder={placeholder}
      error={hasError}
      valueKey="value"
      labelKey="label"
      disabled={disabled}
    />
  );
};

export default TimeSelect;
