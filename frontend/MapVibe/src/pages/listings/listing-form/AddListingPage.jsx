import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import locationService from "../../../services/locationService";
import mediaService from "../../../services/mediaService";
import ListingBasicInformation from "./components/ListingBasicInformation";
import ListingLocation from "./components/ListingLocation";
import ListingGallery from "./components/ListingGallery";
import ListingDetails from "./components/ListingDetails";
import OpeningHours from "./components/OpeningHours";
import ListingPricing from "./components/ListingPricing";

const initialFormData = {
  name: "",
  categoryId: "",
  provinceCode: "",
  wardCode: "",
  address: "",
  latitude: null,
  longitude: null,
  description: "",
  phone: "",
  website: "",
  email: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  images: [],
  amenityIds: [],
  openingHours: [],
  pricingCategories: [],
  pricingItems: [],
  pricingOrder: [],
};

const AddListingPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const openingHoursRef = useRef(null);
  const pricingRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearServerError(name);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    setFormData((prev) => ({
      ...prev,
      categoryId: category?.id ?? "",
    }));

    clearServerError("categoryId");
  };

  const handleLocationChange = ({ latitude, longitude }) => {
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const clearServerError = (field) => {
    setServerErrors((prev) => prev.filter((error) => error.field !== field));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || geocodingLoading) {
      return;
    }

    setServerErrors([]);

    const openingHoursValid = openingHoursRef.current?.validate() ?? true;
    const pricingValid = pricingRef.current?.validate() ?? true;

    if (!openingHoursValid || !pricingValid) {
      toast.error("Vui lòng kiểm tra lại thông tin.");
      return;
    }

    const uploadedImageUrls = [];

    try {
      setLoading(true);

      const imageUrls = await Promise.all(
        formData.images.map(async (image) => {
          const url = await mediaService.uploadImage(image);

          uploadedImageUrls.push(url);

          return url;
        }),
      );

      const payload = {
        ...formData,
        images: imageUrls,
      };

      await locationService.createLocation(payload);

      toast.success("Listing created successfully.");
      navigate("/my-listings", { replace: true });
    } catch (error) {
      await Promise.allSettled(
        uploadedImageUrls.map((imageUrl) => mediaService.deleteImage(imageUrl)),
      );

      const response = error.response?.data;
      const errors = response?.errors || [];

      setServerErrors(errors);
      toast.error(response?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="margin-bottom-65">
      <div id="titlebar" className="gradient">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>
                <i className="sl sl-icon-plus"></i> Add Listing
              </h2>
              <nav id="breadcrumbs">
                <ul>
                  <Link to="/">Home</Link>
                  <li>Add Listing</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div id="add-listing" className="separated-form">
              <ListingBasicInformation
                formData={formData}
                onChange={handleChange}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                serverErrors={serverErrors}
                onClearServerError={clearServerError}
              />

              <ListingLocation
                formData={formData}
                onChange={handleChange}
                onLocationChange={handleLocationChange}
                onGeocodingLoadingChange={setGeocodingLoading}
                serverErrors={serverErrors}
                onClearServerError={clearServerError}
              />

              <ListingGallery
                images={formData.images}
                onChange={(images) =>
                  setFormData((prev) => ({
                    ...prev,
                    images,
                  }))
                }
              />

              <ListingDetails
                formData={formData}
                setFormData={setFormData}
                onChange={handleChange}
              />

              <OpeningHours
                ref={openingHoursRef}
                value={formData.openingHours}
                onChange={(openingHours) =>
                  setFormData((prev) => ({
                    ...prev,
                    openingHours,
                  }))
                }
              />

              <ListingPricing
                ref={pricingRef}
                formData={formData}
                setFormData={setFormData}
              />

              <button
                className="button preview"
                onClick={handleSubmit}
                disabled={loading || geocodingLoading}
              >
                {loading
                  ? "Adding..."
                  : geocodingLoading
                    ? "Finding location..."
                    : "Add Listing"}{" "}
                <i className="fa fa-arrow-circle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListingPage;
