import CheckboxFilter from "../common/CheckboxFilter";

const AmenityFilter = ({ amenities, selectedAmenities, onApply, onClose }) => {
  return (
    <CheckboxFilter
      options={amenities}
      value={selectedAmenities}
      onApply={onApply}
      onClose={onClose}
      multiple
      allLabel="All Amenities"
    />
  );
};

export default AmenityFilter;
