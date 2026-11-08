import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const GalleryModal = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  setCurrentIndex,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animClass, setAnimClass] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isOpen) {
      setShouldRender(true);
      document.body.classList.add("mfp-zoom-out-cur");

      timeoutId = setTimeout(() => {
        setAnimClass(true);
      }, 20);
    } else {
      setAnimClass(false);
      document.body.classList.remove("mfp-zoom-out-cur");

      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }

    return () => {
      clearTimeout(timeoutId);
      document.body.classList.remove("mfp-zoom-out-cur");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images]);

  if (!isOpen || !images || images.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  if (!shouldRender || !images || images.length === 0) {
    return null;
  }

  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <>
      <div
        className={`mfp-bg mfp-fade ${animClass ? "mfp-ready" : ""}`}
        onClick={onClose}
      />
      <div
        className={`mfp-wrap mfp-gallery mfp-auto-cursor mfp-fade ${animClass ? "mfp-ready" : ""}`}
      >
        <div
          className="mfp-container mfp-s-ready mfp-image-holder"
          onClick={handleContainerClick}
        >
          <div className="mfp-content">
            <div className="mfp-figure">
              <div className="mfp-close"></div>
              <figure>
                <img
                  className="mfp-img"
                  src={images[currentIndex]}
                  alt={`Gallery item ${currentIndex + 1}`}
                  style={{
                    maxHeight: "75vh",
                  }}
                />
                <figcaption>
                  <div className="mfp-bottom-bar">
                    <div className="mfp-title">Detail Images</div>
                    <div className="mfp-counter">
                      {currentIndex + 1} of {images.length} images
                    </div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
          <div className="mfp-preloader">Loading...</div>
          {images.length > 1 && (
            <>
              <button
                title="Previous (Left arrow key)"
                type="button"
                className="mfp-arrow mfp-arrow-left mfp-prevent-close"
                onClick={handlePrev}
              ></button>
              <button
                title="Next (Right arrow key)"
                type="button"
                className="mfp-arrow mfp-arrow-right mfp-prevent-close"
                onClick={handleNext}
              ></button>
            </>
          )}
        </div>
        <button
          title="Close (Esc)"
          type="button"
          className="mfp-close"
          onClick={onClose}
        ></button>
      </div>
    </>,
    document.body,
  );
};

export default GalleryModal;
