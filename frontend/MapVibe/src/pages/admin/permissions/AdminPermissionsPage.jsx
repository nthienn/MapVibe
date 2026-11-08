import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { showConfirmToast } from "../../../components/common/ConfirmToast";
import { getApiErrorMessage } from "../../../utils/error";
import { hasSuperAdminRole } from "../../../utils/superAdminRole";
import permissionService from "../../../services/permissionService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import PermissionFormModal from "./PermissionFormModal";

const AdminPermissionsPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [deletingPermissionName, setDeletingPermissionName] = useState(null);

  const canManagePermissions = hasSuperAdminRole();

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const result = await permissionService.getPermissions();
      setPermissions(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const openCreateModal = () => {
    setEditingPermission(null);
    setIsModalOpen(true);
  };

  const openEditModal = (permission) => {
    setEditingPermission(permission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPermission(null);
  };

  const handleDeletePermission = (permission) => {
    if (deletingPermissionName !== null) {
      return;
    }

    showConfirmToast({
      message: `Are you sure you want to delete "${permission.name}"?`,

      onConfirm: async () => {
        try {
          setDeletingPermissionName(permission.name);
          await permissionService.deletePermission(permission.name);
          await fetchPermissions();
          toast.success("Permission deleted successfully.");
        } catch (error) {
          toast.error(
            getApiErrorMessage(
              error,
              "Failed to delete permission. It may still be used by users.",
            ),
          );
        } finally {
          setDeletingPermissionName(null);
        }
      },
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div id="titlebar">
        <div className="row">
          <div className="col-md-12">
            <h2>Permissions ({permissions.length})</h2>
            <nav id="breadcrumbs">
              <ul>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>Permissions</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="dashboard-list-box margin-top-0">
            <h4>Permission Access Control</h4>

            {permissions.length === 0 ? (
              <div className="notification notice">
                <p>No permissions found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="basic-table">
                  <thead>
                    <tr>
                      <th>Permission Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {permissions.map((permission) => {
                      const canEditPermission = canManagePermissions;
                      const canDeletePermission = canManagePermissions;

                      return (
                        <tr key={permission.name}>
                          <td>{permission.name}</td>

                          <td>{permission.description}</td>

                          <td>
                            <div className="button-group">
                              {canEditPermission && (
                                <button
                                  type="button"
                                  className="button gray"
                                  onClick={() => openEditModal(permission)}
                                >
                                  <i className="sl sl-icon-pencil" /> Edit
                                </button>
                              )}

                              {canDeletePermission && (
                                <button
                                  type="button"
                                  className="button gray"
                                  disabled={deletingPermissionName !== null}
                                  onClick={() =>
                                    handleDeletePermission(permission)
                                  }
                                >
                                  <i className="sl sl-icon-trash" />
                                  {deletingPermissionName === permission.name
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              )}

                              {!canDeletePermission && (
                                <div
                                  className="numerical-rating mid"
                                  style={{ width: "90px" }}
                                >
                                  Read only
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

          {canManagePermissions && (
            <div className="admin-add-button">
              <button
                type="button"
                className="button"
                onClick={openCreateModal}
              >
                <i className="sl sl-icon-plus" /> Add Permission
              </button>
            </div>
          )}
        </div>
      </div>

      <PermissionFormModal
        isOpen={isModalOpen}
        permission={editingPermission}
        onClose={closeModal}
        onSaved={fetchPermissions}
      />
    </>
  );
};

export default AdminPermissionsPage;
