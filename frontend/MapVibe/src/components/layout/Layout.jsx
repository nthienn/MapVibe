import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import AuthModal from "../modal/AuthModal";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isMenuVisualOpen, setIsMenuVisualOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState("login");
  const [authModalInitialEmail, setAuthModalInitialEmail] = useState("");

  const isListingsPage = location.pathname === "/listings";

  useEffect(() => {
    const authState = location.state;

    if (!authState?.openAuthModal) {
      return;
    }

    // Thiết lập tab và email cho AuthModal
    setAuthModalInitialTab(authState.authTab || "login");
    setAuthModalInitialEmail(authState.email || "");

    // Mở AuthModal
    openAuthModal();

    // Xóa navigation state để tránh mở modal lại khi refresh
    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      {
        replace: true,
        state: null,
      },
    );
  }, [
    location.state,
    location.pathname,
    location.search,
    location.hash,
    navigate,
    openAuthModal,
  ]);

  const handleCloseAuthModal = () => {
    closeAuthModal();

    // Xóa thông tin khởi tạo để lần mở tiếp theo không dùng email cũ
    setAuthModalInitialTab("login");
    setAuthModalInitialEmail("");
  };

  useEffect(() => {
    const handleGlobalScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleGlobalScroll);
    return () => window.removeEventListener("scroll", handleGlobalScroll);
  }, []);

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

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab={authModalInitialTab}
        initialEmail={authModalInitialEmail}
      />

      <MobileMenu
        isOpen={isMenuVisualOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div id="wrapper" className="mm-page mm-slideout">
        <Header
          onOpenMenu={() => setIsMenuOpen(true)}
          isButtonActive={isButtonActive}
          customClass={isListingsPage ? "fixed fullwidth" : "no-shadow"}
        />

        {children}

        {!isListingsPage && <Footer />}

        {!isListingsPage && (
          <div
            id="backtotop"
            className={showBackToTop ? "visible" : ""}
            onClick={() => window.scrollTo({ top: 0 })}
          >
            <a href="#" onClick={(e) => e.preventDefault()}>
              {" "}
            </a>
          </div>
        )}
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

export default Layout;
