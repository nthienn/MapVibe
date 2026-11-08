import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/error";
import permissionService from "../../../services/permissionService";

const PermissionFormModal = ({
  isOpen,
  permission = null,
  onClose,
  onSaved,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animClass, setAnimClass] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(permission);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(permission?.name ?? "");
    setDescription(permission?.description ?? "");
  }, [isOpen, permission]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!isEditing && !trimmedName) {
      toast.error("Please enter permission name.");
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await permissionService.updatePermission(permission.name, {
          description: trimmedDescription,
        });

        toast.success("Permission updated successfully.");
      } else {
        await permissionService.createPermission({
          name: trimmedName,
          description: trimmedDescription,
        });

        toast.success("Permission created successfully.");
      }

      await onSaved?.();
      onClose?.();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEditing
            ? "Failed to update permission."
            : "Failed to create permission.",
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
                <h3>{isEditing ? "Edit Permission" : "Add Permission"}</h3>
              </div>

              <div className="sign-in-form style-1">
                <div className="tabs-container alt">
                  <div className="tab-content">
                    <form className="login" onSubmit={handleSubmit}>
                      <div className="add-permission">
                        <fieldset>
                          <div>
                            <label htmlFor="permission-name">
                              Permission Name
                            </label>

                            <input
                              id="permission-name"
                              type="text"
                              value={name}
                              onChange={(event) => setName(event.target.value)}
                              disabled={saving || isEditing}
                              placeholder="Enter permission name"
                            />
                          </div>

                          <div>
                            <label htmlFor="permission-description">
                              Description
                            </label>

                            <input
                              id="permission-description"
                              type="text"
                              value={description}
                              onChange={(event) =>
                                setDescription(event.target.value)
                              }
                              disabled={saving}
                              placeholder="Enter permission description"
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
                              : "Create Permission"}
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

export default PermissionFormModal;
