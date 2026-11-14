import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/error";

const AuthModal = ({
  isOpen,
  onClose,
  initialTab = "login",
  initialEmail = "",
}) => {
  const { login, register, resendVerificationEmail } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [shouldRender, setShouldRender] = useState(false);
  const [animClass, setAnimClass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

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

    const email = registerData.email.trim();

    try {
      setRegisterLoading(true);

      await register({
        name: registerData.name.trim(),
        email,
        password: registerData.password,
      });

      // Chuyển sang trạng thái chờ xác thực email
      setVerificationEmail(email);
      setVerificationPending(true);

      // Điền sẵn email ở tab Login
      setLoginData({
        email,
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

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);

      await resendVerificationEmail(verificationEmail);

      toast.success(
        "Nếu tài khoản tồn tại và chưa xác thực, email xác thực sẽ được gửi lại.",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Không thể gửi lại email xác thực."),
      );
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);

      setLoginData({
        email: initialEmail,
        password: "",
      });

      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setVerificationPending(false);
      setVerificationEmail("");
      setResendLoading(false);

      setLoginLoading(false);
      setRegisterLoading(false);
    }
  }, [isOpen, initialTab, initialEmail]);

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
                            className="button border fullwidth margin-top-5"
                            disabled={loginLoading}
                          >
                            {loginLoading ? "Signing In..." : "Login"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Register */}
                  {activeTab === "register" && (
                    <div className="tab-content" id="tab2">
                      {verificationPending ? (
                        <div className="verification-pending">
                          <div className="verification-icon">
                            <h4>
                              <i className="im im-icon-Mail"></i> Verify Your
                              Email
                            </h4>
                          </div>

                          <p className="form-row form-row-wide">
                            <label>
                              Your account has been created successfully. Please
                              check your inbox and verify your email address.
                            </label>
                            <label>
                              We sent a verification link to:{" "}
                              <strong>{verificationEmail}</strong>
                            </label>
                            <label>
                              The verification link expires in 15 minutes.
                            </label>
                          </p>

                          <div className="form-row">
                            <button
                              type="button"
                              className="button border fullwidth margin-top-5"
                              onClick={handleResendVerification}
                              disabled={resendLoading}
                            >
                              {resendLoading
                                ? "Sending..."
                                : "Resend Verification Email"}
                            </button>

                            <div className="margin-top-10 text-center">
                              <label>
                                Already verified your email?{" "}
                                <span className="lost_password">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setActiveTab("login");
                                    }}
                                  >
                                    Log In
                                  </a>
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <form
                          method="post"
                          className="register"
                          onSubmit={handleRegisterSubmit}
                        >
                          {/* Name */}
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
                                required
                                onChange={(e) =>
                                  setRegisterData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                              />
                            </label>
                          </p>

                          {/* Email */}
                          <p className="form-row form-row-wide">
                            <label htmlFor="email2">
                              Email Address:
                              <i className="im im-icon-Mail"></i>
                              <input
                                type="email"
                                className="input-text"
                                name="email"
                                id="email2"
                                value={registerData.email}
                                required
                                autoComplete="email"
                                onChange={(e) =>
                                  setRegisterData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                              />
                            </label>
                          </p>

                          {/* Password */}
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
                                required
                                autoComplete="new-password"
                                onChange={(e) =>
                                  setRegisterData((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                  }))
                                }
                              />
                            </label>
                          </p>

                          {/* Confirm Password */}
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
                                required
                                autoComplete="new-password"
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
                            className="button border fullwidth margin-top-10"
                            disabled={registerLoading}
                          >
                            {registerLoading ? "Registering..." : "Register"}
                          </button>
                        </form>
                      )}
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
