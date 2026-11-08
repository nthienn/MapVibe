import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/error";
import categoryService from "../../../services/categoryService";

const CategoryFormModal = ({ isOpen, category = null, onClose, onSaved }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animClass, setAnimClass] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(category);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(category?.name ?? "");
    setIcon(category?.icon ?? "");
  }, [isOpen, category]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      icon: icon.trim(),
    };

    if (!payload.name || !payload.icon) {
      toast.error("Please enter both category name and icon.");
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await categoryService.updateCategory(category.id, payload);
        toast.success("Category updated successfully.");
      } else {
        await categoryService.createCategory(payload);
        toast.success("Category created successfully.");
      }

      await onSaved?.();
      onClose?.();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEditing
            ? "Failed to update category."
            : "Failed to create category.",
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
                <h3>{isEditing ? "Edit Category" : "Add Category"}</h3>
              </div>

              <div className="sign-in-form style-1">
                <div className="tabs-container alt">
                  <div className="tab-content">
                    <form className="login" onSubmit={handleSubmit}>
                      <div className="add-category">
                        <fieldset>
                          <div>
                            <label htmlFor="category-name">Category Name</label>

                            <input
                              id="category-name"
                              type="text"
                              value={name}
                              onChange={(event) => setName(event.target.value)}
                              disabled={saving}
                              placeholder="Enter category name"
                            />
                          </div>

                          <div>
                            <label htmlFor="category-icon">Icon Class</label>

                            <input
                              id="category-icon"
                              type="text"
                              value={icon}
                              onChange={(event) => setIcon(event.target.value)}
                              disabled={saving}
                              placeholder="e.g. fa fa-cutlery"
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
                              : "Create Category"}
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

export default CategoryFormModal;
