import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/error";
import adminService from "../../../services/adminService";

const getRoleName = (role) => (typeof role === "string" ? role : role?.name);

const EditUserRoleModal = ({ isOpen, user, roles = [], onClose, onSaved }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animClass, setAnimClass] = useState(false);
  const [selectedRoleNames, setSelectedRoleNames] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) {
      return;
    }

    setSelectedRoleNames(
      (user.roles ?? [])
        .map(getRoleName)
        .filter((name) => name && name !== "SUPER_ADMIN"),
    );
  }, [isOpen, user]);

  const handleRoleChange = (roleName, checked) => {
    setSelectedRoleNames((prev) => {
      if (checked) {
        return prev.includes(roleName) ? prev : [...prev, roleName];
      }

      return prev.filter((name) => name !== roleName);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id || saving) {
      return;
    }

    if (selectedRoleNames.length === 0) {
      toast.error("A user must have at least one role.");
      return;
    }

    try {
      setSaving(true);

      const updatedUser = await adminService.updateUserRoles(
        user.id,
        selectedRoleNames,
      );

      toast.success("User roles updated successfully.");

      await onSaved?.(updatedUser);
      onClose?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update user roles."));
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

  if (!shouldRender) {
    return null;
  }

  const editableRoles = roles.filter((role) => role.name !== "SUPER_ADMIN");

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
              className="zoom-anim-dialog edit-user-role-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="small-dialog-header">
                <h3>Edit User Roles</h3>
              </div>

              <div className="sign-in-form style-1">
                <div className="tabs-container alt">
                  <div className="tab-content">
                    <form className="login" onSubmit={handleSubmit}>
                      <div className="user-role-modal-info">
                        <h4>{user?.name}</h4>
                        <h4>{user?.email}</h4>
                      </div>

                      <div className="user-role-modal-options">
                        <div className="checkboxes in-row margin-bottom-20">
                          {editableRoles.length === 0 ? (
                            <p>No roles available.</p>
                          ) : (
                            editableRoles.map((role) => (
                              <React.Fragment key={role.name}>
                                <input
                                  id={`role-${role.name}`}
                                  type="checkbox"
                                  checked={selectedRoleNames.includes(
                                    role.name,
                                  )}
                                  onChange={(event) =>
                                    handleRoleChange(
                                      role.name,
                                      event.target.checked,
                                    )
                                  }
                                  disabled={saving}
                                />

                                <label htmlFor={`role-${role.name}`}>
                                  {role.name} ({role.description})
                                </label>
                              </React.Fragment>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <button
                          type="submit"
                          className="button border margin-top-5"
                          disabled={
                            saving ||
                            selectedRoleNames.length === 0 ||
                            editableRoles.length === 0
                          }
                        >
                          {saving ? "Saving..." : "Save Changes"}
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

export default EditUserRoleModal;
