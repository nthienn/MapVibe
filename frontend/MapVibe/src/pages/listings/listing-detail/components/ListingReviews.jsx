import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { showConfirmToast } from "../../../../components/common/ConfirmToast";
import { formatDate } from "../../../../utils/date";
import { getApiErrorMessage } from "../../../../utils/error";
import reviewService from "../../../../services/reviewService";
import GalleryModal from "../../../../components/modal/GalleryModal";
import StarRating from "../../../../components/common/StarRating";
import Pagination from "../../../../components/common/Pagination";

const ListingReviews = ({
  reviews,
  averageRating,
  pagination,
  onPageChange,
  currentUser,
  locationId,
  onEditReview,
  onReviewChanged,
}) => {
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);

  const openGallery = (e, imagesArray, index) => {
    e.preventDefault();
    setModalImages(imagesArray);
    setModalIndex(index);
    setIsModalOpen(true);
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
          await reviewService.deleteReview(locationId, review.id);

          const pageToLoad =
            reviews.length === 1 && pagination.currentPage > 1
              ? pagination.currentPage - 1
              : pagination.currentPage;

          await onReviewChanged?.(pageToLoad);

          toast.success("Review deleted successfully.");
        } catch (error) {
          toast.error(getApiErrorMessage(error, "Failed to delete review."));
        } finally {
          setDeletingReviewId(null);
        }
      },
    });
  };

  return (
    <>
      <div id="listing-reviews" className="listing-section">
        <h3 className="listing-desc-headline margin-top-75 margin-bottom-20">
          Reviews <span>({pagination.totalElements})</span>
        </h3>

        {/* Rating Overview */}
        <div className="rating-overview">
          <div className="rating-overview-box">
            <span className="rating-overview-box-total">{averageRating}</span>
            <span className="rating-overview-box-percent">out of 5.0</span>
            <div className="star-rating reviews">
              <StarRating rating={averageRating} />
            </div>
          </div>
          <div className="rating-bars">
            <div className="rating-bars-item">
              <span className="rating-bars-name">
                {pagination.totalElements === 0 ? (
                  <span>
                    There are no reviews for this location yet. Be the first to
                    leave a review!
                  </span>
                ) : (
                  <span>
                    {pagination.totalElements} people have visited this location
                    and left a review.
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="clearfix"></div>

        {pagination.totalElements > 0 && (
          <>
            {/* Reviews */}
            <section className="comments listing-reviews">
              <ul>
                {reviews.map((review) => {
                  const isOwner =
                    currentUser?.id && review.user?.id === currentUser.id;

                  const isDeleting = deletingReviewId === review.id;

                  return (
                    <li key={review.id}>
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
                            {review.user.name}
                          </Link>

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

                        {isOwner ? (
                          <div className="button-group">
                            <a
                              href="#"
                              className="rate-review"
                              disabled={isDeleting}
                              onClick={(e) => {
                                e.preventDefault();
                                onEditReview?.(review);
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
                        ) : (
                          <a href="#" className="rate-review">
                            <i className="fa fa-reply"></i> Reply
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* <!-- Pagination --> */}
            <div className="clearfix"></div>
            {pagination.totalPages > 0 && (
              <div className="row">
                <div className="col-md-12">
                  <div className="pagination-container margin-top-30">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={onPageChange}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="clearfix"></div>
          </>
        )}
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

export default ListingReviews;
