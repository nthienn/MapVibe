import React, { useEffect, useState } from "react";
import amenityService from "../../services/amenityService";

const AmenitySelect = ({ selectedIds = [], onChange }) => {
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const result = await amenityService.getAmenities();
        setAmenities(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAmenities();
  }, []);

  const handleToggle = (amenityId) => {
    const isSelected = selectedIds.includes(amenityId);

    const updatedIds = isSelected
      ? selectedIds.filter((id) => id !== amenityId)
      : [...selectedIds, amenityId];

    onChange(updatedIds);
  };

  return (
    <div className="checkboxes in-row margin-bottom-20">
      {amenities.map((amenity) => (
        <React.Fragment key={amenity.id}>
          <input
            id={`amenity-${amenity.id}`}
            type="checkbox"
            checked={selectedIds.includes(amenity.id)}
            onChange={() => handleToggle(amenity.id)}
          />
          <label htmlFor={`amenity-${amenity.id}`}>{amenity.name}</label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default AmenitySelect;
