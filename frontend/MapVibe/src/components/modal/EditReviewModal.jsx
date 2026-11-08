import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/error";
import mediaService from "../../services/mediaService";
import reviewService from "../../services/reviewService";

const EditReviewModal = ({ isOpen, review, locationId, onClose, onSaved }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animClass, setAnimClass] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !review) {
      return;
    }

    setRating(review.rating || 0);
    setHoverRating(0);
    setContent(review.content || "");
    setImages(review.images ? [...review.images] : []);
  }, [isOpen, review]);

  useEffect(() => {
    const nextPreviews = images.map((image) => {
      if (image instanceof File) {
        return {
          image,
          url: URL.createObjectURL(image),
          isFile: true,
        };
      }

      return {
        image,
        url: image,
        isFile: false,
      };
    });

    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => {
        if (preview.isFile) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [images]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (newFiles.length > 0) {
      setImages((prev) => [...prev, ...newFiles]);
    }

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a star rating.");
      return;
    }

    if (!locationId || !review?.id) {
      return;
    }

    const uploadedImageUrls = [];

    try {
      setSaving(true);

      const finalImages = await Promise.all(
        images.map(async (image) => {
          if (typeof image === "string") {
            return image;
          }

          const url = await mediaService.uploadImage(image);

          uploadedImageUrls.push(url);

          return url;
        }),
      );

      const payload = {
        rating,
        content: content.trim(),
        images: finalImages,
      };

      await reviewService.updateReview(locationId, review.id, payload);

      toast.success("Review updated successfully.");

      await onSaved?.();
      onClose?.();
    } catch (error) {
      await Promise.allSettled(
        uploadedImageUrls.map((url) => mediaService.deleteImage(url)),
      );

      toast.error(getApiErrorMessage(error, "Failed to update review."));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    let timeoutId;

    if (isOpen) {
      setShouldRender(true);

      timeoutId = setTimeout(() => {
        setAnimClass(true);
      }, 20);
    } else {
      setAnimClass(false);

      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`mfp-bg my-mfp-zoom-in ${animClass ? "mfp-ready" : ""}`}
        onClick={onClose}
      />
      <div
        className={`mfp-wrap mfp-close-btn-in mfp-auto-cursor my-mfp-zoom-in ${animClass ? "mfp-ready" : ""}`}
        onClick={onClose}
      >
        <div className="mfp-container mfp-inline-holder">
          <div className="mfp-content">
            <div
              id="sign-in-dialog"
              className="zoom-anim-dialog edit-review-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="small-dialog-header">
                <h3>Edit Review</h3>
              </div>

              <div className="sign-in-form style-1">
                <div className="tabs-container alt">
                  <div className="tab-content" id="tab1">
                    <form className="login" onSubmit={handleSubmit}>
                      <div className="add-sub-rating">
                        <div className="sub-rating-title">Star rating</div>

                        <div className="sub-rating-stars edit-review-rating">
                          <div className="clearfix"></div>
                          <div className="leave-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className="fa fa-star"
                                style={{
                                  fontSize: "21px",
                                  color:
                                    star <= (hoverRating || rating)
                                      ? "#ffc600"
                                      : "#ddd",
                                  transition: "color 0.1s",
                                  marginRight: "4px",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="uploadButton margin-top-15">
                        <input
                          className="uploadButton-input"
                          type="file"
                          name="attachments[]"
                          accept="image/*"
                          id="review-upload"
                          multiple
                          onChange={handleFileChange}
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
                                  <img
                                    src={preview.url}
                                    alt={`Review ${index + 1}`}
                                  />
                                </div>

                                <div className="dz-details">
                                  {preview.isFile && (
                                    <>
                                      <div className="dz-size">
                                        <span>
                                          {(
                                            preview.image.size /
                                            1024 /
                                            1024
                                          ).toFixed(2)}{" "}
                                          MB
                                        </span>
                                      </div>

                                      <div className="dz-filename">
                                        <span>{preview.image.name}</span>
                                      </div>
                                    </>
                                  )}

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

                      <div id="add-comment" className="add-comment">
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
                      </div>

                      <div className="form-row">
                        <button
                          type="submit"
                          className="button border margin-top-5"
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save Review"}
                        </button>

                        <button
                          type="button"
                          className="button gray margin-top-5"
                          disabled={saving}
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <button
                title="Close"
                type="button"
                className="mfp-close"
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditReviewModal;
