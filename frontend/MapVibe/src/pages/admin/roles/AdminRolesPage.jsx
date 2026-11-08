import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { showConfirmToast } from "../../../components/common/ConfirmToast";
import { getApiErrorMessage } from "../../../utils/error";
import { hasSuperAdminRole } from "../../../utils/superAdminRole";
import roleService from "../../../services/roleService";
import permissionService from "../../../services/permissionService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import RoleFormModal from "./RoleFormModal";

const SYSTEM_ROLES = new Set(["USER", "ADMIN", "SUPER_ADMIN"]);

const getPermissionName = (permission) =>
  typeof permission === "string" ? permission : permission?.name;

const AdminRolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingRoleName, setDeletingRoleName] = useState(null);

  const canManageRoles = hasSuperAdminRole();

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const result = await roleService.getRoles();
      setRoles(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (role) => {
    if (deletingRoleName !== null) {
      return;
    }

    showConfirmToast({
      message: `Are you sure you want to delete "${role.name}"?`,

      onConfirm: async () => {
        try {
          setDeletingRoleName(role.name);
          await roleService.deleteRole(role.name);
          await fetchRoles();
          toast.success("Role deleted successfully.");
        } catch (error) {
          toast.error(
            getApiErrorMessage(
              error,
              "Failed to delete role. It may still be used by users.",
            ),
          );
        } finally {
          setDeletingRoleName(null);
        }
      },
    });
  };

  useEffect(() => {
    let active = true;

    const fetchPermissions = async () => {
      try {
        const permissions = await permissionService.getPermissions();

        if (active) {
          setPermissions(permissions ?? []);
        }
      } catch (error) {
        if (active) {
          toast.error(getApiErrorMessage(error, "Failed to load permissions."));
        }
      }
    };

    fetchPermissions();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div id="titlebar">
        <div className="row">
          <div className="col-md-12">
            <h2>Roles ({roles.length})</h2>
            <nav id="breadcrumbs">
              <ul>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>Roles</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="dashboard-list-box margin-top-0">
            <h4>Role Access Control</h4>

            {roles.length === 0 ? (
              <div className="notification notice">
                <p>No roles found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="basic-table">
                  <thead>
                    <tr>
                      <th>Role Name</th>
                      <th>Description</th>
                      <th>Permissions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {roles.map((role) => {
                      const isSystemRole = SYSTEM_ROLES.has(role.name);

                      const canEditRole =
                        canManageRoles && role.name !== "SUPER_ADMIN";

                      const canDeleteRole = canManageRoles && !isSystemRole;

                      return (
                        <tr key={role.name}>
                          <td>{role.name}</td>

                          <td>{role.description}</td>

                          <td>
                            <div className="admin-user-permissions">
                              {(role.permissions ?? []).map(
                                (permission, index) => {
                                  const permissionName =
                                    getPermissionName(permission);

                                  return (
                                    <div
                                      key={`${permissionName}-${index}`}
                                      className="numerical-rating high"
                                      style={{ width: "140px" }}
                                    >
                                      {permissionName}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </td>

                          <td>
                            <div className="button-group">
                              {canEditRole && (
                                <button
                                  type="button"
                                  className="button gray"
                                  onClick={() => openEditModal(role)}
                                >
                                  <i className="sl sl-icon-pencil" /> Edit
                                </button>
                              )}

                              {canDeleteRole && (
                                <button
                                  type="button"
                                  className="button gray"
                                  disabled={deletingRoleName !== null}
                                  onClick={() => handleDeleteRole(role)}
                                >
                                  <i className="sl sl-icon-trash" />
                                  {deletingRoleName === role.name
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              )}

                              {!canManageRoles && (
                                <div
                                  className="numerical-rating mid"
                                  style={{ width: "90px" }}
                                >
                                  Read only
                                </div>
                              )}

                              {canManageRoles &&
                                role.name === "SUPER_ADMIN" && (
                                  <div
                                    className="numerical-rating low"
                                    style={{ width: "90px" }}
                                  >
                                    Protected
                                  </div>
                                )}

                              {canManageRoles &&
                                isSystemRole &&
                                role.name !== "SUPER_ADMIN" && (
                                  <div
                                    className="numerical-rating mid"
                                    style={{ width: "110px" }}
                                  >
                                    Cannot delete
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {canManageRoles && (
            <div className="admin-add-button">
              <button
                type="button"
                className="button"
                onClick={openCreateModal}
              >
                <i className="sl sl-icon-plus" /> Add Role
              </button>
            </div>
          )}
        </div>
      </div>

      <RoleFormModal
        isOpen={isModalOpen}
        role={editingRole}
        permissions={permissions}
        onClose={closeModal}
        onSaved={fetchRoles}
      />
    </>
  );
};

export default AdminRolesPage;
