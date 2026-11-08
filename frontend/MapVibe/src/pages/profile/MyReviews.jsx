import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { formatLocationAddress } from "../../utils/locationAddress";
import { showConfirmToast } from "../../components/common/ConfirmToast";
import { getApiErrorMessage } from "../../utils/error";
import reviewService from "../../services/reviewService";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StarRating from "../../components/common/StarRating";
import GalleryModal from "../../components/modal/GalleryModal";
import EditReviewModal from "../../components/modal/EditReviewModal";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 6,
  });

  const openGallery = (e, imagesArray, index) => {
    e.preventDefault();
    setModalImages(imagesArray);
    setModalIndex(index);
    setIsGalleryModalOpen(true);
  };

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const result = await reviewService.getMyReviews({ page });
      setReviews(result.data);
      setPagination(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handlePageChange = (page) => {
    fetchReviews(page);
  };

  const openEditReviewModal = (review) => {
    setEditingReview(review);
    setIsEditReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsEditReviewModalOpen(false);
    setEditingReview(null);
  };

  const handleDeleteReview = async (review) => {
    if (deletingReviewId !== null) {
      return;
    }

    showConfirmToast({
      message: "Are you sure you want to delete this review?",
      onConfirm: async () => {
        try {
          setDeletingReviewId(review.id);
          await reviewService.deleteReview(review.location.id, review.id);

          const pageToLoad =
            reviews.length === 1 && pagination.currentPage > 1
              ? pagination.currentPage - 1
              : pagination.currentPage;

          await fetchReviews(pageToLoad);
          toast.success("Review deleted successfully.");
        } catch (error) {
          toast.error(getApiErrorMessage(error, "Failed to delete review."));
        } finally {
          setDeletingReviewId(null);
        }
      },
    });
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
              <h2>My Reviews ({pagination.totalElements})</h2>
              <nav id="breadcrumbs">
                <ul>
                  <Link to="/">Home</Link>
                  <li>My Reviews</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {reviews.length === 0 ? (
          <div className="notification notice large">
            <h4>You haven't reviewed any places yet.</h4>
          </div>
        ) : (
          <div className="row sticky-wrapper">
            <div className="col-lg-12 col-md-12">
              <div className="dashboard-list-box margin-top-0 shadow">
                <h4>Reviews</h4>
                <ul>
                  {reviews.map((review) => {
                    const formattedAddress = formatLocationAddress(
                      review.location,
                    );

                    const isDeleting = deletingReviewId === review.id;

                    return (
                      <li key={review.id}>
                        <div className="comments listing-reviews">
                          <ul>
                            <li>
                              <div className="avatar">
                                <img
                                  src={review.location.images?.[0]}
                                  alt={review.location.name}
                                />
                              </div>

                              <div className="comment-content">
                                <div className="comment-by">
                                  <div className="comment-by-listing">
                                    <Link
                                      to={`/listings/${review.location.slug}`}
                                    >
                                      {review.location.name}
                                    </Link>
                                  </div>

                                  <span className="date">
                                    {formattedAddress}
                                  </span>

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

                                <div className="button-group">
                                  <a
                                    href="#"
                                    className="rate-review"
                                    disabled={isDeleting}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      openEditReviewModal(review);
                                    }}
                                  >
                                    <i className="sl sl-icon-pencil"></i>
                                    Edit
                                  </a>

                                  <a
                                    href="#"
                                    className="rate-review"
                                    disabled={isDeleting}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDeleteReview(review);
                                    }}
                                  >
                                    <i className="sl sl-icon-trash"></i>
                                    {isDeleting ? "Deleting..." : "Delete"}
                                  </a>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {pagination.totalPages > 0 && (
              <div className="col-md-12">
                <div className="pagination-container margin-top-30">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        images={modalImages}
        currentIndex={modalIndex}
        setCurrentIndex={setModalIndex}
      />

      <EditReviewModal
        isOpen={isEditReviewModalOpen}
        review={editingReview}
        locationId={editingReview?.location?.id}
        onClose={closeReviewModal}
        onSaved={fetchReviews}
      />
    </div>
  );
};

export default MyReviews;
