import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/error";
import { formatDate } from "../../../utils/date";
import { showConfirmToast } from "../../../components/common/ConfirmToast";
import adminService from "../../../services/adminService";
import reviewService from "../../../services/reviewService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import StarRating from "../../../components/common/StarRating";
import Pagination from "../../../components/common/Pagination";
import GalleryModal from "../../../components/modal/GalleryModal";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
  };

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const result = await adminService.getAllReviews({ page });
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
    <>
      <div id="titlebar">
        <div className="row">
          <div className="col-md-12">
            <h2>Reviews ({pagination.totalElements})</h2>
            <nav id="breadcrumbs">
              <ul>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>Reviews</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="dashboard-list-box margin-top-0">
            <h4>Review Management</h4>

            {reviews.length === 0 ? (
              <div className="notification notice">
                <p>No reviews found.</p>
              </div>
            ) : (
              <ul>
                {reviews.map((review) => {
                  const isDeleting = deletingReviewId === review.id;

                  return (
                    <li key={review.id}>
                      <div className="comments listing-reviews">
                        <ul>
                          <li>
                            <div className="avatar">
                              <Link to={`/users/${review.user.id}/profile`}>
                                <img
                                  src={review.user.avatar}
                                  alt={review.user.name}
                                />
                              </Link>
                            </div>

                            <div className="comment-content">
                              <div className="comment-by">
                                <Link to={`/users/${review.user.id}/profile`}>
                                  {review.user.name}{" "}
                                </Link>

                                <div className="comment-by-listing">
                                  on{" "}
                                  <Link
                                    to={`/listings/${review.location.slug}`}
                                  >
                                    {review.location.name}
                                  </Link>
                                </div>

                                <span className="date">
                                  {formatDate(review.createdAt)}
                                </span>

                                <div className="star-rating">
                                  <StarRating rating={review.rating} />
                                </div>
                              </div>

                              <p>{review.content}</p>

                              {review.images?.length > 0 && (
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
                          </li>
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
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
      </div>

      <GalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={modalImages}
        currentIndex={modalIndex}
        setCurrentIndex={setModalIndex}
      />
    </>
  );
};

export default AdminReviewsPage;
