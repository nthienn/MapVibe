import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/error";

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [shouldRender, setShouldRender] = useState(false);
  const [animClass, setAnimClass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const loginPasswordRef = useRef(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoginLoading(true);
      await login(loginData);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Đăng nhập thất bại."));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setRegisterLoading(true);

      await register({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
      });

      toast.success("Đăng ký thành công. Vui lòng đăng nhập.");
      setActiveTab("login");

      requestAnimationFrame(() => {
        loginPasswordRef.current?.focus();
      });

      setLoginData({
        email: registerData.email.trim(),
        password: "",
      });

      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Đăng ký thất bại."));
    } finally {
      setRegisterLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoginData({
        email: "",
        password: "",
      });

      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setLoginLoading(false);
      setRegisterLoading(false);
    }
  }, [isOpen]);

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

  return (
    <>
      <div
        className={`mfp-bg my-mfp-zoom-in ${animClass ? "mfp-ready" : ""}`}
        onClick={onClose}
      ></div>
      <div
        className={`mfp-wrap mfp-close-btn-in mfp-auto-cursor my-mfp-zoom-in ${animClass ? "mfp-ready" : ""}`}
        onClick={onClose}
      >
        <div className="mfp-container mfp-inline-holder">
          <div className="mfp-content">
            <div
              id="sign-in-dialog"
              className="zoom-anim-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="small-dialog-header">
                <h3>Sign In</h3>
              </div>

              {/* Tabs */}
              <div className="sign-in-form style-1">
                <ul className="tabs-nav">
                  <li className={activeTab === "login" ? "active" : ""}>
                    <a
                      href="#tab1"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("login");
                      }}
                    >
                      Log In
                    </a>
                  </li>
                  <li className={activeTab === "register" ? "active" : ""}>
                    <a
                      href="#tab2"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("register");
                      }}
                    >
                      Register
                    </a>
                  </li>
                </ul>

                <div className="tabs-container alt">
                  {/* Login */}
                  {activeTab === "login" && (
                    <div className="tab-content" id="tab1">
                      <form
                        method="post"
                        className="login"
                        onSubmit={handleLoginSubmit}
                      >
                        <p className="form-row form-row-wide">
                          <label htmlFor="email">
                            Email Address:
                            <i className="im im-icon-Mail"></i>
                            <input
                              type="text"
                              className="input-text"
                              name="email"
                              id="email"
                              value={loginData.email}
                              onChange={(e) =>
                                setLoginData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </p>

                        <p className="form-row form-row-wide">
                          <label htmlFor="password">
                            Password:
                            <i className="im im-icon-Lock-2"></i>
                            <input
                              ref={loginPasswordRef}
                              className="input-text"
                              type="password"
                              name="password"
                              id="password"
                              value={loginData.password}
                              onChange={(e) =>
                                setLoginData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                            />
                          </label>
                          <span className="lost_password">
                            <a href="#">Lost Your Password?</a>
                          </span>
                        </p>

                        <div className="form-row">
                          <button
                            type="submit"
                            className="button border margin-top-5"
                            disabled={loginLoading}
                          >
                            {loginLoading ? "Signing In..." : "Login"}
                          </button>
                          <div className="checkboxes margin-top-10">
                            <input
                              id="remember-me"
                              type="checkbox"
                              name="check"
                            />
                            <label htmlFor="remember-me">Remember Me</label>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Register */}
                  {activeTab === "register" && (
                    <div className="tab-content" id="tab2">
                      <form
                        method="post"
                        className="register"
                        onSubmit={handleRegisterSubmit}
                      >
                        <p className="form-row form-row-wide">
                          <label htmlFor="username2">
                            Name:
                            <i className="im im-icon-Male"></i>
                            <input
                              type="text"
                              className="input-text"
                              name="username"
                              id="username2"
                              value={registerData.name}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </p>

                        <p className="form-row form-row-wide">
                          <label htmlFor="email2">
                            Email Address:
                            <i className="im im-icon-Mail"></i>
                            <input
                              type="text"
                              className="input-text"
                              name="email"
                              id="email2"
                              value={registerData.email}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </p>

                        <p className="form-row form-row-wide">
                          <label htmlFor="password1">
                            Password:
                            <i className="im im-icon-Lock-2"></i>
                            <input
                              className="input-text"
                              type="password"
                              name="password1"
                              id="password1"
                              value={registerData.password}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </p>

                        <p className="form-row form-row-wide">
                          <label htmlFor="password2">
                            Repeat Password:
                            <i className="im im-icon-Lock-2"></i>
                            <input
                              className="input-text"
                              type="password"
                              name="password2"
                              id="password2"
                              value={registerData.confirmPassword}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </p>

                        <button
                          type="submit"
                          className="button border fw margin-top-10"
                          disabled={registerLoading}
                        >
                          {registerLoading ? "Registering..." : "Register"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              <button
                title="Close"
                type="button"
                className="mfp-close"
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
