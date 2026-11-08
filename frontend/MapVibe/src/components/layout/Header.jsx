import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { menuConfig } from "../../config/menuConfig";
import { canViewMenuItem } from "../../utils/auth";

const Header = ({
  onOpenMenu,
  isButtonActive,
  customClass,
  menuItems = menuConfig,
  isDashboard = false,
}) => {
  const { isLoggedIn, user, logout, openAuthModal } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [activeUserMenu, setActiveUserMenu] = useState(null);

  const location = useLocation();
  const isListingsPage = location.pathname === "/listings";
  const isListingDetailPage = location.pathname.startsWith("/listings/");
  const isAdminPage = location.pathname.startsWith("/admin");

  const isStickyEnabled =
    !isListingsPage && !isListingDetailPage && !isAdminPage;

  useEffect(() => {
    if (!isStickyEnabled) return;

    const handleScroll = () => {
      if (window.scrollY > 135) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isStickyEnabled]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu")) {
        setActiveUserMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter Menu: Show only items that don't require login, OR show all if logged in.
  const visibleMenu = menuItems.filter((item) => canViewMenuItem(item, user));

  const { pathname } = useLocation();

  const isPathActive = (path) => {
    if (!path) return false;

    // Home chỉ active khi ở đúng trang chủ.
    if (path === "/") {
      return pathname === "/";
    }

    // Active cả trang chính và các trang con.
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isMenuItemActive = (item) => {
    if (isPathActive(item.path)) {
      return true;
    }

    return item.children?.some(isMenuItemActive) ?? false;
  };

  const renderHeaderContent = (isClone = false) => (
    <div className="container">
      {/* Left Side Content */}
      <div className="left-side">
        <div id="logo">
          {isDashboard ? (
            <>
              <Link to="/admin" className="default-logo">
                <img src="/images/logo.png" alt="Logo" />
              </Link>

              <Link to="/admin" className="dashboard-logo">
                <img src="/images/logo2.png" alt="Logo" />
              </Link>
            </>
          ) : (
            <Link to="/">
              <img src="/images/logo.png" alt="Logo" />
            </Link>
          )}
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="mmenu-trigger" onClick={onOpenMenu}>
          <button
            className={`hamburger hamburger--collapse ${isButtonActive ? "is-active" : ""}`}
            type="button"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav id="navigation" className="style-1">
          <ul id="responsive">
            {visibleMenu.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={isMenuItemActive(item) ? "current" : ""}
                >
                  {item.title}
                </Link>
                {/* If there is a second-level submenu, render the next ul tag. */}
                {item.children && item.children.length > 0 && (
                  <ul>
                    {item.children.map((subItem, index) => (
                      <li key={index}>
                        <Link
                          to={subItem.path}
                          className={isMenuItemActive(subItem) ? "current" : ""}
                        >
                          <i className={subItem.icon}></i> {subItem.title}
                        </Link>
                        {/* If there is a level 3 submenu, render the next ul tag. */}
                        {subItem.children && subItem.children.length > 0 && (
                          <ul>
                            {subItem.children.map((thirdItem, tIndex) => (
                              <li key={tIndex}>
                                <Link
                                  to={thirdItem.path}
                                  className={
                                    isMenuItemActive(thirdItem) ? "current" : ""
                                  }
                                >
                                  {thirdItem.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="clearfix"></div>
      </div>

      {/* Right Side Content */}
      <div className="right-side">
        <div className="header-widget">
          {isLoggedIn ? (
            <>
              <div
                className={`user-menu ${
                  activeUserMenu === (isClone ? "clone" : "main")
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveUserMenu(
                    activeUserMenu === (isClone ? "clone" : "main")
                      ? null
                      : isClone
                        ? "clone"
                        : "main",
                  )
                }
              >
                <div className="user-name">
                  <span>
                    <img src={user.avatar} alt="Avatar" />
                  </span>
                  Hi, {user.name}
                </div>
                <ul>
                  <li>
                    <Link to="/my-profile">
                      <i className="sl sl-icon-settings"></i> My Profile
                    </Link>
                  </li>

                  <li>
                    <Link to="/my-listings">
                      <i className="sl sl-icon-location"></i> My Listings
                    </Link>
                  </li>

                  <li>
                    <Link to="/my-bookmarks">
                      <i className="sl sl-icon-heart"></i> My Bookmarks
                    </Link>
                  </li>

                  <li>
                    <Link to="/my-reviews">
                      <i className="sl sl-icon-star"></i> My Reviews
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
                      <i className="sl sl-icon-power"></i> Logout
                    </a>
                  </li>
                </ul>
              </div>

              <Link to="/listings/add" className="button border with-icon">
                Add Listing <i className="sl sl-icon-plus"></i>
              </Link>
            </>
          ) : (
            <>
              <a
                href="#sign-in-dialog"
                className="sign-in popup-with-zoom-anim"
                onClick={(e) => {
                  e.preventDefault();
                  openAuthModal();
                }}
              >
                <i className="sl sl-icon-login"></i> Sign In
              </a>
              <a
                href="#sign-in-dialog"
                className="sign-in popup-with-zoom-anim button border with-icon"
                onClick={(e) => {
                  e.preventDefault();
                  openAuthModal();
                }}
              >
                Add Listing <i className="sl sl-icon-plus"></i>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header id="header-container" className={customClass}>
        <div id="header">{renderHeaderContent(false)}</div>

        {isStickyEnabled && (
          <div
            id="header"
            className={`cloned ${isSticky ? "sticky" : "unsticky"}`}
          >
            {renderHeaderContent(true)}
          </div>
        )}
      </header>
      <div className="clearfix"></div>
    </>
  );
};

export default Header;
