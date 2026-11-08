import ChosenSelect from "../common/ChosenSelect";

const SORT_OPTIONS = [
  {
    value: "default",
    label: "Default Order",
  },
  {
    value: "highest_rated",
    label: "Highest Rated",
  },
  {
    value: "most_reviewed",
    label: "Most Reviewed",
  },
  {
    value: "newest",
    label: "Newest Listings",
  },
  {
    value: "oldest",
    label: "Oldest Listings",
  },
];

const SortSelect = ({ value = "default", onChange }) => {
  const handleChange = (option) => {
    onChange?.(option?.value ?? "default");
  };

  return (
    <ChosenSelect
      options={SORT_OPTIONS}
      value={value}
      onChange={handleChange}
      valueKey="value"
      labelKey="label"
      hidePlaceholderOption
    />
  );
};

export default SortSelect;
