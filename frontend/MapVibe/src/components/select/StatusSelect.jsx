import ChosenSelect from "../common/ChosenSelect";

const STATUS_OPTIONS = [
  {
    value: "ALL",
    label: "All Listings",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "PENDING",
    label: "Pending Review",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
];

const StatusSelect = ({ value = "ALL", onChange }) => {
  const handleChange = (option) => {
    onChange?.(option?.value ?? "ALL");
  };

  return (
    <ChosenSelect
      options={STATUS_OPTIONS}
      value={value}
      onChange={handleChange}
      valueKey="value"
      labelKey="label"
      hidePlaceholderOption
    />
  );
};

export default StatusSelect;
