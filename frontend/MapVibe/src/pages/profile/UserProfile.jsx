import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/error";
import { formatLocationAddress } from "../../utils/locationAddress";
import userService from "../../services/userService";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StarRating from "../../components/common/StarRating";
import GalleryModal from "../../components/modal/GalleryModal";
import ListingCard from "../../components/listing/ListingCard";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);

  const openGallery = (e, imagesArray, index) => {
    e.preventDefault();
    setModalImages(imagesArray);
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const [listingsPagination, setListingsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 6,
  });

  const [reviewsPagination, setReviewsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 3,
  });

  const fetchProfile = async (listingsPage = 1, reviewsPage = 1) => {
    try {
      setLoading(true);

      const result = await userService.getUserProfile(id, {
        listingsPage,
        listingsSize: 6,
        reviewsPage,
        reviewsSize: 3,
      });

      setProfile(result);
      setListings(result.listings?.data || []);
      setReviews(result.reviews?.data || []);
      setListingsPagination(result.listings || {});
      setReviewsPagination(result.reviews || {});
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load user profile."));

      if (error.response?.status === 404) {
        navigate("/404", { replace: true });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(1, 1);
  }, [id]);

  const handleListingsPageChange = (page) => {
    fetchProfile(page, reviewsPagination.currentPage);
  };

  const handleReviewsPageChange = (page) => {
    fetchProfile(listingsPagination.currentPage, page);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="margin-bottom-65">
      <div id="titlebar" className="gradient">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="user-profile-titlebar">
                <div className="user-profile-avatar">
                  <img src={profile.user.avatar} alt={profile.user.name} />
                </div>
                <div className="user-profile-name">
                  <h2>{profile.user.name}</h2>
                  <div className="star-rating">
                    <StarRating rating={profile.averageRating} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row sticky-wrapper">
          <div className="col-lg-12 col-md-12">
            <h3 className="margin-top-0 margin-bottom-40">
              {profile.user.name}'s Listings ({listingsPagination.totalElements}
              )
            </h3>
            <div className="row">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>

          {listingsPagination.totalPages > 0 && (
            <div className="col-md-12">
              <div className="pagination-container margin-top-30">
                <Pagination
                  currentPage={listingsPagination.currentPage}
                  totalPages={listingsPagination.totalPages}
                  onPageChange={handleListingsPageChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div id="listing-reviews" className="listing-section">
          <h3 className="margin-top-60 margin-bottom-20">
            Reviews by {profile.user.name} ({reviewsPagination.totalElements})
          </h3>
          <div className="clearfix"></div>
          <section className="comments listing-reviews">
            <ul>
              {reviews.map((review) => {
                const formattedAddress = formatLocationAddress(review.location);

                return (
                  <li key={review.id}>
                    <div className="avatar">
                      <img
                        src={review.location.images?.[0]}
                        alt={review.location.name}
                      />
                    </div>

                    <div className="comment-content">
                      <div className="comment-by">
                        <div className="comment-by-listing">
                          <Link to={`/listings/${review.location.slug}`}>
                            {review.location.name}
                          </Link>
                        </div>

                        <span className="date">{formattedAddress}</span>

                        <div className="star-rating">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>

                      <p>{review.content}</p>

                      {review.images.length > 0 && (
                        <div className="review-images mfp-gallery-container">
                          {review.images.map((imgUrl, index) => (
                            <a
                              key={index}
                              href={imgUrl}
                              className="mfp-gallery"
                              onClick={(e) => {
                                openGallery(e, review.images, index);
                              }}
                            >
                              <img
                                src={imgUrl}
                                alt={`Review attachment ${index + 1}`}
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {reviewsPagination.totalPages > 0 && (
            <div className="col-md-12">
              <div className="pagination-container margin-top-30">
                <Pagination
                  currentPage={reviewsPagination.currentPage}
                  totalPages={reviewsPagination.totalPages}
                  onPageChange={handleReviewsPageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <GalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={modalImages}
        currentIndex={modalIndex}
        setCurrentIndex={setModalIndex}
      />
    </div>
  );
};

export default UserProfile;
