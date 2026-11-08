import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { mapLocationToFormData } from "../../../utils/listingFormMapper";
import { useAuth } from "../../../context/AuthContext";
import locationService from "../../../services/locationService";
import mediaService from "../../../services/mediaService";
import ListingBasicInformation from "./components/ListingBasicInformation";
import ListingLocation from "./components/ListingLocation";
import ListingGallery from "./components/ListingGallery";
import ListingDetails from "./components/ListingDetails";
import OpeningHours from "./components/OpeningHours";
import ListingPricing from "./components/ListingPricing";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

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

const EditListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const openingHoursRef = useRef(null);
  const pricingRef = useRef(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const result = await locationService.getLocationById(id);

        const isAdmin =
          user?.roles?.some((role) => role.name === "ADMIN") ?? false;

        const isOwner = result.user?.id === user?.id;
        const status = result.status?.toUpperCase();

        const canEdit =
          (status === "ACTIVE" && (isAdmin || isOwner)) ||
          (["PENDING", "REJECTED"].includes(status) && isOwner);

        if (!canEdit) {
          toast.info("Bạn không có quyền chỉnh sửa listing này.");

          navigate(
            isAdmin && !isOwner ? `/admin/listings/${id}` : "/my-listings",
            { replace: true },
          );

          return;
        }

        setFormData(mapLocationToFormData(result));
        setSelectedCategory(result.category || null);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin địa điểm.");
        navigate("/my-listings", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || geocodingLoading) {
      return;
    }

    const openingHoursValid = openingHoursRef.current?.validate() ?? true;
    const pricingValid = pricingRef.current?.validate() ?? true;

    if (!openingHoursValid || !pricingValid) {
      toast.error("Vui lòng kiểm tra lại thông tin.");
      return;
    }

    const uploadedImageUrls = [];

    try {
      setSubmitting(true);

      const uploadedImages = await Promise.all(
        formData.images.map(async (image) => {
          // Existing image
          if (typeof image === "string") {
            return image;
          }

          // New image
          const url = await mediaService.uploadImage(image);

          uploadedImageUrls.push(url);

          return url;
        }),
      );

      const payload = {
        ...formData,
        images: uploadedImages,
      };

      await locationService.updateLocation(id, payload);

      toast.success("Listing edited successfully.");
      navigate(`/my-listings`);
    } catch (error) {
      await Promise.allSettled(
        uploadedImageUrls.map((imageUrl) => mediaService.deleteImage(imageUrl)),
      );

      const response = error.response?.data;
      const errors = response?.errors || [];

      setServerErrors(errors);
      toast.error(response?.message);
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="margin-bottom-65">
      <div id="titlebar" className="gradient">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>
                <i className="sl sl-icon-plus"></i> Edit Listing
              </h2>
              <nav id="breadcrumbs">
                <ul>
                  <Link to="/">Home</Link>
                  <li>Edit Listing</li>
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
                disabled={submitting || geocodingLoading}
              >
                {submitting
                  ? "Editing..."
                  : geocodingLoading
                    ? "Finding location..."
                    : "Edit Listing"}{" "}
                <i className="fa fa-arrow-circle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditListingPage;
