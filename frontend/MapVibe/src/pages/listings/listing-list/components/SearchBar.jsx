import { useEffect, useState } from "react";
import LocationAutocomplete from "../../../../components/listing/LocationAutocomplete";
import CategoryFilter from "../../../../components/select/CategoryFilter";
import AmenityFilter from "../../../../components/select/AmenityFilter";
import SortSelect from "../../../../components/select/SortSelect";
import DistanceRadiusFilter from "../../../../components/select/DistanceRadiusFilter";

const SearchBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  amenities,
  selectedAmenities,
  onAmenitiesApply,
  searchText,
  onSearchTextChange,
  selectedLocation,
  onLocationSelect,
  radius,
  onRadiusApply,
  onRadiusDisable,
  sort,
  onSortChange,
  onSearch,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleCategoryApply = (category) => {
    onCategoryChange(category);
    onSearch(category);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".panel-dropdown")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  return (
    <section className="search">
      <div className="row">
        <div className="col-md-12">
          <div className="row with-forms">
            {/* Main Search Input */}
            <div className="col-fs-6">
              <div className="input-with-icon location">
                <LocationAutocomplete
                  value={searchText}
                  onChange={onSearchTextChange}
                  onSelect={onLocationSelect}
                  onSearch={onSearch}
                />
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <i className="sl sl-icon-magnifier"></i>
                </a>
              </div>
            </div>

            {/* Filters */}
            <div className="col-fs-12">
              {/* Dropdown Categories */}
              <div
                className={`panel-dropdown ${activeDropdown === "categories" ? "active" : ""}`}
              >
                <a
                  href="#categories"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("categories");
                  }}
                >
                  Categories
                </a>
                <div className="panel-dropdown-content checkboxes categories">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onApply={handleCategoryApply}
                    onClose={() => setActiveDropdown(null)}
                  />
                </div>
              </div>

              {/* Dropdown More Filters */}
              <div
                className={`panel-dropdown wide ${activeDropdown === "more" ? "active" : ""}`}
              >
                <a
                  href="#more"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("more");
                  }}
                >
                  More Filters
                </a>
                <div className="panel-dropdown-content checkboxes">
                  <AmenityFilter
                    amenities={amenities}
                    selectedAmenities={selectedAmenities}
                    onApply={(value) => {
                      onAmenitiesApply(value);
                      setActiveDropdown(null);
                    }}
                    onClose={() => setActiveDropdown(null)}
                  />
                </div>
              </div>

              {/* Dropdown Distance Radius */}
              <div
                className={`panel-dropdown ${activeDropdown === "distance" ? "active" : ""}`}
              >
                <a
                  href="#distance"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("distance");
                  }}
                >
                  Distance Radius
                </a>
                <div className="panel-dropdown-content">
                  <DistanceRadiusFilter
                    radius={radius}
                    selectedLocation={selectedLocation}
                    onApply={onRadiusApply}
                    onDisable={onRadiusDisable}
                    onClose={() => setActiveDropdown(null)}
                  />
                </div>
              </div>

              {/* Dropdown Sort */}
              <div className="sort-by">
                <div className="sort-by-select">
                  <SortSelect value={sort} onChange={onSortChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
