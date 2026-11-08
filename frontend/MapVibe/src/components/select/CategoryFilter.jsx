import CheckboxFilter from "../common/CheckboxFilter";

const CategoryFilter = ({ categories, selectedCategory, onApply, onClose }) => {
  return (
    <CheckboxFilter
      options={categories}
      value={selectedCategory}
      onApply={onApply}
      onClose={onClose}
      allLabel="All Categories"
    />
  );
};

export default CategoryFilter;
