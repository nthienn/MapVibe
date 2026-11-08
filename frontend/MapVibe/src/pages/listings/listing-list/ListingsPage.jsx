import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import {
  buildSearchParams,
  getSearchParams,
} from "../../../utils/searchParams";
import categoryService from "../../../services/categoryService";
import amenityService from "../../../services/amenityService";
import locationService from "../../../services/locationService";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ListingsMap from "../../../components/map/ListingsMap";

const ListingsPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(null);
  const [sort, setSort] = useState("default");
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoveredListingId, setHoveredListingId] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 6,
  });

  const handleMarkerClick = (listingId) => {
    setHoveredListingId(listingId);

    requestAnimationFrame(() => {
      const card = document.querySelector(
        `.listing-item-container[data-marker-id="${listingId}"]`,
      );

      if (!card) return;

      card.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

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

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const amenities = await amenityService.getAmenities();
        setAmenities(amenities);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAmenities();
  }, []);

  const getSelectedAmenityIds = () =>
    selectedAmenities.map((amenity) => amenity.id);

  const fetchListings = async ({
    keyword = null,
    categorySlug = null,
    locationId = null,
    radius = null,
    amenityIds = [],
    sort = "default",
    page = 1,
  }) => {
    try {
      setLoading(true);

      const params = {};

      if (keyword) {
        params.keyword = keyword;
      }

      if (categorySlug) {
        params.category = categorySlug;
      }

      if (locationId !== null) {
        params.locationId = locationId;

        if (radius !== null) {
          params.radius = radius;
        }
      }

      if (amenityIds.length > 0) {
        params.amenityIds = amenityIds;
      }

      if (sort && sort !== "default") {
        params.sort = sort;
      }

      params.page = page;

      const result = await locationService.getLocations(params);

      setListings(result.data);
      setPagination(result);
      setHoveredListingId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const {
      keyword: keywordParam,
      category: categorySlug,
      location: locationParam,
      locationId: locationIdParam,
      radius: radiusParam,
      amenityIds: amenityIdsParam,
      sort: sortParam,
      page,
    } = getSearchParams(searchParams);

    if (locationIdParam !== null) {
      setSearchText(locationParam);

      setSelectedLocation({
        id: locationIdParam,
        name: locationParam,
      });
    } else {
      setSearchText(keywordParam);
      setSelectedLocation(null);
    }

    setRadius(radiusParam);
    setSort(sortParam || "default");

    const category = categorySlug
      ? categories.find((item) => item.slug === categorySlug) || null
      : null;

    setSelectedCategory(category);

    const selectedAmenitiesFromParams = amenityIdsParam
      .map((id) => amenities.find((amenity) => amenity.id === id))
      .filter(Boolean);

    setSelectedAmenities(selectedAmenitiesFromParams);

    fetchListings({
      keyword: locationIdParam !== null ? null : keywordParam,
      categorySlug,
      locationId: locationIdParam,
      radius: radiusParam,
      amenityIds: amenityIdsParam,
      sort: sortParam || "default",
      page,
    });
  }, [searchParams, categories, amenities, user]);

  const handleSearchSubmit = (categoryOverride = selectedCategory) => {
    if (selectedLocation) {
      setSearchParams(
        buildSearchParams({
          category: categoryOverride,
          location: selectedLocation.name,
          locationId: selectedLocation.id,
          radius,
          amenityIds: getSelectedAmenityIds(),
          sort,
        }),
      );

      return;
    }

    setSearchParams(
      buildSearchParams({
        keyword: searchText,
        category: categoryOverride,
        amenityIds: getSelectedAmenityIds(),
        sort,
      }),
    );
  };

  const handlePageChange = (page) => {
    if (selectedLocation) {
      setSearchParams(
        buildSearchParams({
          category: selectedCategory,
          location: selectedLocation.name,
          locationId: selectedLocation.id,
          radius,
          amenityIds: getSelectedAmenityIds(),
          sort,
          page,
        }),
      );

      return;
    }

    setSearchParams(
      buildSearchParams({
        keyword: searchText,
        category: selectedCategory,
        amenityIds: getSelectedAmenityIds(),
        sort,
        page,
      }),
    );
  };

  const handleSearchTextChange = (value) => {
    setSearchText(value);

    if (selectedLocation) {
      setSelectedLocation(null);
      setRadius(null);
    }
  };

  const handleLocationSelect = (location) => {
    setSearchText(location.name);

    setSelectedLocation({
      id: location.id,
      name: location.name,
    });

    setRadius(null);

    setSearchParams(
      buildSearchParams({
        category: selectedCategory,
        location: location.name,
        locationId: location.id,
        amenityIds: getSelectedAmenityIds(),
        sort,
      }),
    );
  };

  const handleRadiusApply = (newRadius) => {
    if (!selectedLocation) {
      return;
    }

    setRadius(newRadius);

    setSearchParams(
      buildSearchParams({
        category: selectedCategory,
        location: selectedLocation.name,
        locationId: selectedLocation.id,
        radius: newRadius,
        amenityIds: getSelectedAmenityIds(),
        sort,
      }),
    );
  };

  const handleRadiusDisable = () => {
    setRadius(null);

    if (!selectedLocation) {
      return;
    }

    setSearchParams(
      buildSearchParams({
        category: selectedCategory,
        location: selectedLocation.name,
        locationId: selectedLocation.id,
        amenityIds: getSelectedAmenityIds(),
        sort,
      }),
    );
  };

  const handleAmenitiesApply = (newAmenities) => {
    setSelectedAmenities(newAmenities);

    const amenityIds = newAmenities.map((amenity) => amenity.id);

    if (selectedLocation) {
      setSearchParams(
        buildSearchParams({
          category: selectedCategory,
          location: selectedLocation.name,
          locationId: selectedLocation.id,
          radius,
          amenityIds,
          sort,
        }),
      );

      return;
    }

    setSearchParams(
      buildSearchParams({
        keyword: searchText,
        category: selectedCategory,
        amenityIds,
        sort,
      }),
    );
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);

    if (selectedLocation) {
      setSearchParams(
        buildSearchParams({
          category: selectedCategory,
          location: selectedLocation.name,
          locationId: selectedLocation.id,
          radius,
          amenityIds: selectedAmenities.map((amenity) => amenity.id),
          sort: newSort,
        }),
      );

      return;
    }

    setSearchParams(
      buildSearchParams({
        keyword: searchText,
        category: selectedCategory,
        amenityIds: selectedAmenities.map((amenity) => amenity.id),
        sort: newSort,
      }),
    );
  };

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.getElementById("header-container");
      if (header) {
        document.documentElement.style.setProperty(
          "--header-height",
          `${header.offsetHeight}px`,
        );
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  if (loading || !listings) {
    return <LoadingSpinner />;
  }

  return (
    <div className="fs-container">
      <div className="fs-inner-container content">
        <div className="fs-content">
          {/* Search */}
          <SearchBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            amenities={amenities}
            selectedAmenities={selectedAmenities}
            onAmenitiesApply={handleAmenitiesApply}
            searchText={searchText}
            onSearchTextChange={handleSearchTextChange}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            radius={radius}
            onRadiusApply={handleRadiusApply}
            onRadiusDisable={handleRadiusDisable}
            sort={sort}
            onSortChange={handleSortChange}
            onSearch={handleSearchSubmit}
          />

          <Results
            listings={listings}
            setListings={setListings}
            pagination={pagination}
            onPageChange={handlePageChange}
            onListingHover={setHoveredListingId}
            hoveredListingId={hoveredListingId}
          />
        </div>
      </div>

      <div className="fs-inner-container map-fixed">
        <div id="map-container">
          <ListingsMap
            listings={listings}
            hoveredListingId={hoveredListingId}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
