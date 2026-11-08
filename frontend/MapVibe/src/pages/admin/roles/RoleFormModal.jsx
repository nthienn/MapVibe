import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/error";
import roleService from "../../../services/roleService";

const RoleFormModal = ({
  isOpen,
  role = null,
  permissions = [],
  onClose,
  onSaved,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animClass, setAnimClass] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(role);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(role?.name ?? "");
    setDescription(role?.description ?? "");
    setSelectedPermissions(
      Array.isArray(role?.permissions)
        ? role.permissions.map((permission) => permission.name)
        : [],
    );
  }, [isOpen, role]);

  const handlePermissionChange = (permissionName, checked) => {
    setSelectedPermissions((prev) => {
      if (checked) {
        return prev.includes(permissionName) ? prev : [...prev, permissionName];
      }

      return prev.filter((name) => name !== permissionName);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!isEditing && !trimmedName) {
      toast.error("Please enter role name.");
      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        await roleService.updateRole(role.name, {
          description: trimmedDescription,
          permissions: selectedPermissions,
        });

        toast.success("Role updated successfully.");
      } else {
        await roleService.createRole({
          name: trimmedName,
          description: trimmedDescription,
          permissions: selectedPermissions,
        });

        toast.success("Role created successfully.");
      }

      await onSaved?.();
      onClose?.();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEditing ? "Failed to update role." : "Failed to create role.",
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
                <h3>{isEditing ? "Edit Role" : "Add Role"}</h3>
              </div>

              <div className="sign-in-form style-1">
                <div className="tabs-container alt">
                  <div className="tab-content">
                    <form className="login" onSubmit={handleSubmit}>
                      <div className="add-role">
                        <fieldset>
                          <div>
                            <label htmlFor="role-name">Role Name</label>

                            <input
                              id="role-name"
                              type="text"
                              value={name}
                              onChange={(event) => setName(event.target.value)}
                              disabled={saving || isEditing}
                              placeholder="Enter role name"
                            />
                          </div>

                          <div>
                            <label htmlFor="role-description">
                              Description
                            </label>

                            <input
                              id="role-description"
                              type="text"
                              value={description}
                              onChange={(event) =>
                                setDescription(event.target.value)
                              }
                              disabled={saving}
                              placeholder="Enter role description"
                            />
                          </div>

                          <div className="role-permission-modal-options">
                            <label>Permissions</label>

                            <div className="checkboxes in-row margin-bottom-20">
                              {permissions.length === 0 ? (
                                <p>No permissions available.</p>
                              ) : (
                                permissions.map((permission) => (
                                  <React.Fragment key={permission.name}>
                                    <input
                                      id={`permission-${permission.name}`}
                                      type="checkbox"
                                      checked={selectedPermissions.includes(
                                        permission.name,
                                      )}
                                      onChange={(event) =>
                                        handlePermissionChange(
                                          permission.name,
                                          event.target.checked,
                                        )
                                      }
                                      disabled={saving}
                                    />

                                    <label
                                      htmlFor={`permission-${permission.name}`}
                                    >
                                      {permission.name} (
                                      {permission.description})
                                    </label>
                                  </React.Fragment>
                                ))
                              )}
                            </div>
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
                              : "Create Role"}
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

export default RoleFormModal;
