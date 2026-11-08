import { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";
import ChosenSelect from "../common/ChosenSelect";

const CategorySelect = ({
  selectedCategory,
  onChange,
  placeholder = "All Categories",
  categoryError,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await categoryService.getCategories();

        setCategories(categories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <ChosenSelect
      options={categories}
      value={selectedCategory?.id ?? null}
      onChange={onChange}
      placeholder={placeholder}
      error={categoryError}
      valueKey="id"
      labelKey="name"
    />
  );
};

export default CategorySelect;
