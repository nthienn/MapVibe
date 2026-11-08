import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/error";
import amenityService from "../../../services/amenityService";

const AmenityFormModal = ({ isOpen, amenity = null, onClose, onSaved }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animClass, setAnimClass] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(amenity);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(amenity?.name ?? "");
  }, [isOpen, amenity]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter amenity name.");
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await amenityService.updateAmenity(amenity.id, { name: trimmedName });
        toast.success("Amenity updated successfully.");
      } else {
        await amenityService.createAmenity({ name: trimmedName });
        toast.success("Amenity created successfully.");
      }

      await onSaved();
      onClose();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEditing ? "Failed to update amenity." : "Failed to create amenity.",
        ),
      );
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

  return createPortal(
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
              className="zoom-anim-dialog"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="small-dialog-header">
                <h3>{isEditing ? "Edit Amenity" : "Add Amenity"}</h3>
              </div>

              <div className="sign-in-form style-1">
                <div className="tabs-container alt">
                  <div className="tab-content">
                    <form className="login" onSubmit={handleSubmit}>
                      <div className="add-amenity">
                        <fieldset>
                          <div>
                            <label htmlFor="amenity-name">Amenity Name</label>

                            <input
                              id="amenity-name"
                              type="text"
                              value={name}
                              onChange={(event) => setName(event.target.value)}
                              disabled={saving}
                              placeholder="Enter amenity name"
                            />
                          </div>
                        </fieldset>
                      </div>

                      <div className="form-row">
                        <button
                          type="submit"
                          className="button border margin-top-5"
                          disabled={saving}
                        >
                          {saving
                            ? "Saving..."
                            : isEditing
                              ? "Save Changes"
                              : "Create Amenity"}
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
                disabled={saving}
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default AmenityFormModal;
