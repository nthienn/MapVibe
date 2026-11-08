import { useEffect, useRef, useState } from "react";

const ListingGallery = ({ images = [], onChange }) => {
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef(null);

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

  const addFiles = (files) => {
    if (!files.length) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (!imageFiles.length) return;

    onChange([...images, ...imageFiles]);
  };

  const handleFileChange = (e) => {
    addFiles(Array.from(e.target.files || []));
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addFiles(Array.from(e.dataTransfer.files || []));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="add-listing-section margin-top-45">
      <div className="add-listing-headline">
        <h3>
          <i className="sl sl-icon-picture"></i> Gallery
        </h3>
      </div>

      {/* Dropzone */}
      <div className="submit-section">
        <div
          className="dropzone dz-clickable"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="dz-default dz-message">
            <span>
              <i className="sl sl-icon-plus"></i> Click here or drop files to
              upload
            </span>
          </div>

          {previews.map((preview, index) => (
            <div
              className="dz-preview dz-image-preview"
              key={`${preview.url}-${index}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dz-image">
                <img src={preview.url} alt={`Listing ${index + 1}`} />
              </div>
              <div className="dz-details">
                {preview.isFile && (
                  <>
                    <div className="dz-size">
                      <span>
                        {(preview.image.size / 1024 / 1024).toFixed(2)} MB
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
                    handleRemove(index);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingGallery;
