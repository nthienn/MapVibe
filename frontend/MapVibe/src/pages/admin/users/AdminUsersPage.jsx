import { useEffect, useState } from "react";
import { Link } from "react-router";
import { formatDate } from "../../../utils/date";
import { toast } from "react-toastify";
import { showConfirmToast } from "../../../components/common/ConfirmToast";
import { getApiErrorMessage } from "../../../utils/error";
import { useAuth } from "../../../context/AuthContext";
import adminService from "../../../services/adminService";
import roleService from "../../../services/roleService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Pagination from "../../../components/common/Pagination";
import EditUserRoleModal from "./EditUserRoleModal";

const getRoleName = (role) => (typeof role === "string" ? role : role?.name);

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    pageSize: 6,
  });

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const result = await adminService.getUsers({ page });
      setUsers(result.data);
      setPagination(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const handleToggleUserStatus = (user) => {
    if (updatingUserId !== null) {
      return;
    }

    const isSuspended = user.status === "SUSPENDED";

    if (user.status !== "ACTIVE" && user.status !== "SUSPENDED") {
      toast.error("Unknown user status.");
      return;
    }

    showConfirmToast({
      message: isSuspended
        ? `Reactivate the account of ${user.name}?`
        : `Suspend the account of ${user.name}?`,

      onConfirm: async () => {
        try {
          setUpdatingUserId(user.id);

          const updatedUser = isSuspended
            ? await adminService.reactivateUser(user.id)
            : await adminService.suspendUser(user.id);

          setUsers((prevUsers) =>
            prevUsers.map((item) =>
              item.id === user.id ? { ...item, ...updatedUser } : item,
            ),
          );

          toast.success(
            isSuspended
              ? "User reactivated successfully."
              : "User suspended successfully.",
          );
        } catch (error) {
          toast.error(
            getApiErrorMessage(
              error,
              isSuspended
                ? "Failed to reactivate user."
                : "Failed to suspend user.",
            ),
          );
        } finally {
          setUpdatingUserId(null);
        }
      },
    });
  };

  useEffect(() => {
    let active = true;

    const fetchRoles = async () => {
      try {
        const roles = await roleService.getRoles();

        if (active) {
          setRoles((roles ?? []).filter((role) => role.name !== "SUPER_ADMIN"));
        }
      } catch (error) {
        if (active) {
          toast.error(getApiErrorMessage(error, "Failed to load roles."));
        }
      }
    };

    fetchRoles();

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
            <h2>Users ({pagination.totalElements})</h2>
            <nav id="breadcrumbs">
              <ul>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>Users</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="dashboard-list-box margin-top-0">
            <h4>User Management</h4>

            {users.length === 0 ? (
              <div className="notification notice">
                <p>No users found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="basic-table">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created at</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="list-box-listing-img">
                            <Link to={`/users/${user.id}/profile`}>
                              <img src={user.avatar} alt={user.name} />
                            </Link>
                          </div>
                        </td>

                        <td>
                          <Link to={`/users/${user.id}/profile`}>
                            {user.name}
                          </Link>
                        </td>

                        <td>{user.email}</td>

                        <td>
                          <div className="admin-user-roles">
                            {(user.roles ?? []).map((role, index) => {
                              const roleName = getRoleName(role);

                              let ratingClass;

                              if (roleName?.toUpperCase() === "USER") {
                                ratingClass = "high";
                              } else if (roleName?.toUpperCase() === "ADMIN") {
                                ratingClass = "mid";
                              } else {
                                ratingClass = "low";
                              }

                              const isProtectedUser = user.roles?.some(
                                (item) => getRoleName(item) === "SUPER_ADMIN",
                              );

                              const canEditRoles =
                                user.id !== currentUser?.id && !isProtectedUser;

                              const openRoleModal = () => {
                                if (canEditRoles) {
                                  setEditingUser(user);
                                }
                              };

                              return (
                                <div
                                  key={`${roleName}-${index}`}
                                  className={`numerical-rating ${ratingClass}`}
                                  role={canEditRoles ? "button" : undefined}
                                  tabIndex={canEditRoles ? 0 : undefined}
                                  title={
                                    canEditRoles
                                      ? "Click to edit roles"
                                      : undefined
                                  }
                                  style={{ width: "100px" }}
                                  onClick={openRoleModal}
                                >
                                  {roleName}
                                </div>
                              );
                            })}
                          </div>
                        </td>

                        <td>{formatDate(user.createdAt)}</td>

                        <td>
                          <div
                            className={`numerical-rating ${
                              user.status === "SUSPENDED" ? "mid" : "high"
                            }`}
                            style={{ width: "100px" }}
                          >
                            {user.status}
                          </div>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="button gray"
                            disabled={updatingUserId !== null}
                            onClick={() => handleToggleUserStatus(user)}
                          >
                            {updatingUserId === user.id ? (
                              "Processing..."
                            ) : user.status === "SUSPENDED" ? (
                              <>
                                <i className="sl sl-icon-close"></i> Reactivate
                              </>
                            ) : (
                              <>
                                <i className="sl sl-icon-check"></i> Suspend
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {pagination.totalPages > 0 && (
            <div className="row">
              <div className="col-md-12">
                <div className="pagination-container margin-top-30">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditUserRoleModal
        isOpen={!!editingUser}
        user={editingUser}
        roles={roles}
        onClose={() => setEditingUser(null)}
        onSaved={(updatedUser) => {
          setUsers((prevUsers) =>
            prevUsers.map((item) =>
              item.id === updatedUser.id ? { ...item, ...updatedUser } : item,
            ),
          );
        }}
      />
    </>
  );
};

export default AdminUsersPage;
