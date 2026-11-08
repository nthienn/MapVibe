import { useEffect, useState } from "react";
import { adminMenuConfig } from "../../config/menuConfig";
import { ToastContainer } from "react-toastify";
import Header from "../../components/layout/Header";
import MobileMenu from "../../components/layout/MobileMenu";
import DashboardNav from "./components/DashboardNav";
import DashboardResponsiveNavTrigger from "./components/DashboardResponsiveNavTrigger";

const AdminLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isMenuVisualOpen, setIsMenuVisualOpen] = useState(false);
  const [isDashboardNavOpen, setIsDashboardNavOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      setIsButtonActive(true);
      setIsMenuVisualOpen(true);
    } else {
      const timer = setTimeout(() => {
        setIsButtonActive(false);
        setIsMenuVisualOpen(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const wrapper = document.getElementById("wrapper");

    if (isMenuOpen) {
      document.documentElement.classList.add(
        "mm-opened",
        "mm-blocking",
        "mm-background",
        "mm-opening",
      );

      if (wrapper) {
        wrapper.style.minHeight = `${window.innerHeight}px`;
      }
    } else {
      document.documentElement.classList.remove("mm-opening");

      const transitionTimer = setTimeout(() => {
        document.documentElement.classList.remove(
          "mm-opened",
          "mm-blocking",
          "mm-background",
        );

        if (wrapper) {
          wrapper.style.minHeight = "";
        }
      }, 400);

      return () => clearTimeout(transitionTimer);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove(
        "mm-opened",
        "mm-blocking",
        "mm-background",
        "mm-opening",
      );
    };
  }, []);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.getElementById("header-container");
      if (header) {
        document.documentElement.style.setProperty(
          "--header-height",
          `${header.offsetHeight}px`,
        );
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  return (
    <>
      <MobileMenu
        isOpen={isMenuVisualOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={adminMenuConfig}
      />

      <div id="wrapper" className="mm-page mm-slideout">
        <Header
          onOpenMenu={() => setIsMenuOpen(true)}
          isButtonActive={isButtonActive}
          customClass="fixed fullwidth dashboard"
          menuItems={adminMenuConfig}
          isDashboard
        />

        <div id="dashboard">
          <DashboardResponsiveNavTrigger
            isOpen={isDashboardNavOpen}
            onClick={() => setIsDashboardNavOpen((current) => !current)}
          />

          <DashboardNav isOpen={isDashboardNavOpen} />

          <div className="dashboard-content">
            {children}

            <div className="row">
              {/* <!-- Copyrights --> */}
              <div className="col-md-12">
                <div className="copyrights">
                  © {new Date().getFullYear()} Listeo. All Rights Reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMenuVisualOpen && (
        <div
          id="mm-blocker"
          className="mm-slideout"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminLayout;
