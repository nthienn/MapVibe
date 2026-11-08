import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../../utils/error";
import mediaService from "../../../../services/mediaService";
import reviewService from "../../../../services/reviewService";

const ListingAddReview = ({ locationId, onReviewChanged }) => {
  const { isLoggedIn, openAuthModal } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nextPreviews = images.map((image) => ({
      image,
      url: URL.createObjectURL(image),
      isFile: true,
    }));

    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [images]);

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!locationId) {
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    const uploadedImageUrls = [];

    try {
      setLoading(true);

      const imageUrls = await Promise.all(
        images.map(async (file) => {
          const url = await mediaService.uploadImage(file);
          uploadedImageUrls.push(url);
          return url;
        }),
      );

      const payload = {
        rating: userRating,
        content: content.trim(),
        images: imageUrls,
      };

      await reviewService.createReview(locationId, payload);

      toast.success("Review submitted successfully.");

      setUserRating(0);
      setHoverRating(0);
      setContent("");
      setImages([]);

      const fileInput = document.getElementById("review-upload");

      if (fileInput) {
        fileInput.value = "";
      }

      await onReviewChanged?.(1);
    } catch (error) {
      await Promise.allSettled(
        uploadedImageUrls.map((url) => mediaService.deleteImage(url)),
      );

      toast.error(getApiErrorMessage(error, "Failed to submit review."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div id="add-review" className="add-review-box">
          {/* <!-- Add Review --> */}
          <h3 className="listing-desc-headline margin-bottom-10">Add Review</h3>

          {/* Subratings Container */}
          <div className="sub-ratings-container">
            {/* Subrating */}
            <div className="add-sub-rating">
              <div className="sub-rating-title">
                Star rating{" "}
                <i
                  className="tip"
                  data-tip-content="Quality of customer service and attitude to work with you"
                ></i>
              </div>

              <div className="sub-rating-stars">
                {/* Leave Rating */}
                <div className="clearfix"></div>
                <div className="leave-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className="fa fa-star"
                      style={{
                        fontSize: "21px",
                        color:
                          star <= (hoverRating || userRating)
                            ? "#ffc600"
                            : "#ddd",
                        transition: "color 0.1s",
                        marginRight: "4px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(star)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Photos */}
            <div className="uploadButton margin-top-15">
              <input
                className="uploadButton-input"
                type="file"
                name="attachments[]"
                accept="image/*"
                id="review-upload"
                multiple
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files || []);
                  setImages((prev) => [...prev, ...newFiles]);
                  e.target.value = "";
                }}
              />
              <label
                className="uploadButton-button ripple-effect"
                htmlFor="review-upload"
              >
                Add Photos
              </label>

              {previews.length > 0 && (
                <div
                  className="dropzone dz-clickable"
                  style={{ marginTop: 20 }}
                >
                  {previews.map((preview, index) => (
                    <div
                      className="dz-preview dz-image-preview"
                      key={`${preview.url}-${index}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="dz-image">
                        <img src={preview.url} alt={`Review ${index + 1}`} />
                      </div>

                      <div className="dz-details">
                        <div className="dz-size">
                          <span>
                            {(preview.image.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>

                        <div className="dz-filename">
                          <span>{preview.image.name}</span>
                        </div>

                        <button
                          type="button"
                          className="dz-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review Comment */}
          <form id="add-comment" className="add-comment">
            <fieldset>
              <div>
                <label>Review:</label>
                <textarea
                  cols="40"
                  rows="3"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
            </fieldset>

            <button
              className="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
            <div className="clearfix"></div>
          </form>
        </div>
      ) : (
        <div
          id="add-review"
          className="notification notice large margin-top-70 margin-bottom-55"
        >
          <h4>
            Please{" "}
            <a
              href="#sign-in-dialog"
              className="sign-in popup-with-zoom-anim"
              onClick={(e) => {
                e.preventDefault();
                openAuthModal();
              }}
            >
              <strong>Sign In</strong>
            </a>{" "}
            to rate this place. 🙂
          </h4>
        </div>
      )}
    </>
  );
};

export default ListingAddReview;
