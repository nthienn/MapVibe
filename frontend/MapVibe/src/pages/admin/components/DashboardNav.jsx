import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import adminService from "../../../services/adminService";

const DashboardNav = ({ isOpen }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const isDashboardActive = location.pathname === "/admin";
  const isProfileActive = location.pathname === "/my-profile";
  const isReviewActive = location.pathname === "/admin/reviews";
  const isUserActive = location.pathname === "/admin/users";
  const isCategoryActive = location.pathname === "/admin/categories";
  const isAmenityActive = location.pathname === "/admin/amenities";
  const isRoleActive = location.pathname === "/admin/roles";
  const isPermissionActive = location.pathname === "/admin/permissions";

  const isListingsActive = location.pathname.startsWith("/admin/listings/");

  const [isListingsOpen, setIsListingsOpen] = useState(isListingsActive);

  const [statusCounts, setStatusCounts] = useState({
    PENDING: 0,
    ACTIVE: 0,
    REJECTED: 0,
    INACTIVE: 0,
  });

  useEffect(() => {
    if (isListingsActive) {
      setIsListingsOpen(true);
    }
  }, [isListingsActive]);

  useEffect(() => {
    let cancelled = false;

    const fetchStatusCounts = async () => {
      try {
        const counts = await adminService.getListingStatusCounts();

        if (!cancelled) {
          setStatusCounts((prev) => ({
            ...prev,
            ...counts,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch listing status counts:", error);
      }
    };

    fetchStatusCounts();

    window.addEventListener("admin-listing-status-changed", fetchStatusCounts);

    return () => {
      cancelled = true;
      window.removeEventListener(
        "admin-listing-status-changed",
        fetchStatusCounts,
      );
    };
  }, []);

  return (
    <div className={`dashboard-nav ${isOpen ? "active" : ""}`}>
      <div className="dashboard-nav-inner">
        {/* Main */}
        <ul data-submenu-title="Main">
          <li className={isDashboardActive ? "active" : ""}>
            <Link to="/admin">
              <i className="sl sl-icon-settings"></i>
              Dashboard
            </Link>
          </li>
        </ul>

        {/* Management */}
        <ul data-submenu-title="Management">
          <li className={isListingsActive || isListingsOpen ? "active" : ""}>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setIsListingsOpen((current) => !current);
              }}
            >
              <i className="sl sl-icon-layers"></i>
              Listings
            </a>

            <ul>
              <li>
                <Link to="/admin/listings/pending">
                  Pending
                  <span className="nav-tag yellow">{statusCounts.PENDING}</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/listings/active">
                  Active
                  <span className="nav-tag green">{statusCounts.ACTIVE}</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/listings/rejected">
                  Rejected
                  <span className="nav-tag red">{statusCounts.REJECTED}</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/listings/inactive">
                  Inactive
                  <span className="nav-tag gray">{statusCounts.INACTIVE}</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className={isReviewActive ? "active" : ""}>
            <Link to="/admin/reviews">
              <i className="sl sl-icon-star"></i>
              Reviews
            </Link>
          </li>

          <li className={isUserActive ? "active" : ""}>
            <Link to="/admin/users">
              <i className="sl sl-icon-user"></i>
              Users
            </Link>
          </li>

          <li>
            <Link to="/listings/add">
              <i className="sl sl-icon-plus"></i>
              Add Listing
            </Link>
          </li>
        </ul>

        {/* Configuration */}
        <ul data-submenu-title="Configuration">
          <li className={isCategoryActive ? "active" : ""}>
            <Link to="/admin/categories">
              <i className="sl sl-icon-tag" />
              Categories
            </Link>
          </li>

          <li className={isAmenityActive ? "active" : ""}>
            <Link to="/admin/amenities">
              <i className="sl sl-icon-list"></i>
              Amenities
            </Link>
          </li>
        </ul>

        {/* Access Control */}
        <ul data-submenu-title="Access Control">
          <li className={isRoleActive ? "active" : ""}>
            <Link to="/admin/roles">
              <i className="sl sl-icon-user-following"></i>
              Roles
            </Link>
          </li>

          <li className={isPermissionActive ? "active" : ""}>
            <Link to="/admin/permissions">
              <i className="sl sl-icon-lock"></i>
              Permissions
            </Link>
          </li>
        </ul>

        {/* Account */}
        <ul data-submenu-title="Account">
          <li className={isProfileActive ? "active" : ""}>
            <Link to="/my-profile">
              <i className="sl sl-icon-user"></i>
              My Profile
            </Link>
          </li>

          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              <i className="sl sl-icon-power"></i>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardNav;
