import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import useBookmark from "../../../hooks/useBookmark";
import locationService from "../../../services/locationService";
import reviewService from "../../../services/reviewService";
import ListingTitlebar from "./components/ListingTitlebar";
import ListingOverview from "./components/ListingOverview";
import ListingPricing from "./components/ListingPricing";
import ListingLocation from "./components/ListingLocation";
import ListingSidebar from "./components/ListingSidebar";
import ListingReviews from "./components/ListingReviews";
import ListingNav from "./components/ListingNav";
import ListingSlider from "./components/ListingSlider";
import ListingAddReview from "./components/ListingAddReview";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EditReviewModal from "../../../components/modal/EditReviewModal";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/error";

const ListingDetailPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { slug } = useParams();
  const navRef = useRef(null);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [activeSection, setActiveSection] = useState("listing-overview");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  const [reviewPagination, setReviewPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 3,
  });

  const fetchLocationDetail = async () => {
    try {
      setLoading(true);
      const result = await locationService.getLocationDetail(slug);
      setLocation(result);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load location."));

      if (error.response?.status === 404) {
        navigate("/404", { replace: true });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchLocationDetail();
    }
  }, [slug, user]);

  const fetchReviews = async (page = 1) => {
    try {
      const result = await reviewService.getReviews(location.id, { page });
      setReviews(result.data);
      setReviewPagination(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (location?.id) {
      fetchReviews();
    }
  }, [location?.id]);

  const handleReviewPageChange = (page) => {
    fetchReviews(page);
  };

  const refreshReviewData = async (page = 1) => {
    await Promise.all([fetchLocationDetail(), fetchReviews(page)]);
  };

  const { toggleBookmark } = useBookmark();

  const handleBookmarkToggle = async () => {
    await toggleBookmark(location.id, (result) => {
      setLocation((prev) => ({
        ...prev,
        bookmarked: result.bookmarked,
        bookmarkCount: result.bookmarkCount,
      }));
    });
  };

  const hasPricing =
    location &&
    (location.pricingCategories.length > 0 || location.pricingItems.length > 0);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);

    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 70;

      window.scrollTo({ top: offsetPosition });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        setIsNavSticky(navRef.current.getBoundingClientRect().top <= 0);
      }

      const sections = [
        "listing-overview",
        "listing-location",
        "listing-reviews",
        "add-review",
      ];
      if (hasPricing) {
        sections.splice(1, 0, "listing-pricing-list");
      }

      let currentSection = "listing-overview";
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && el.getBoundingClientRect().top <= 100) {
          currentSection = sectionId;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasPricing]);

  if (loading || !location) {
    return <LoadingSpinner />;
  }

  return (
    <div className="listing-detail-page">
      {/* Listing Nav Sticky */}
      <div
        id="listing-nav"
        className={`listing-nav-container cloned ${isNavSticky ? "stick" : ""}`}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <ListingNav
                activeSection={activeSection}
                scrollToSection={scrollToSection}
                hasPricing={hasPricing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slider */}
      <ListingSlider images={location.images} />

      {/* Content */}
      <div className="container">
        <div className="row sticky-wrapper">
          <div className="col-lg-8 col-md-8 padding-right-30">
            {/* Titlebar */}
            <ListingTitlebar location={location} />

            {/* Listing Nav */}
            <div
              ref={navRef}
              id="listing-overview"
              className="listing-nav-container"
            >
              <ListingNav
                activeSection={activeSection}
                scrollToSection={scrollToSection}
                hasPricing={hasPricing}
              />
            </div>

            {/* Overview */}
            <ListingOverview location={location} />

            {/* <!-- Pricing --> */}
            <ListingPricing
              pricingCategories={location.pricingCategories}
              pricingItems={location.pricingItems}
              pricingOrder={location.pricingOrder}
            />

            {/* Location */}
            <ListingLocation location={location} />

            {/* Reviews */}
            <ListingReviews
              reviews={reviews}
              averageRating={location.averageRating}
              pagination={reviewPagination}
              onPageChange={handleReviewPageChange}
              currentUser={user}
              locationId={location.id}
              onEditReview={setEditingReview}
              onReviewChanged={refreshReviewData}
            />

            <EditReviewModal
              isOpen={!!editingReview}
              review={editingReview}
              locationId={location.id}
              onClose={() => setEditingReview(null)}
              onSaved={() => refreshReviewData(reviewPagination.currentPage)}
            />

            {/* <!-- Add Review Box --> */}
            <ListingAddReview
              locationId={location.id}
              onReviewChanged={refreshReviewData}
            />
          </div>

          {/* Sidebar */}
          <ListingSidebar
            location={location}
            onBookmarkToggle={handleBookmarkToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
