import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../utils/error";
import authService from "../services/authService";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Verification token is missing.");
        return;
      }

      try {
        const verifiedEmail = await authService.verifyEmail(token);

        toast.success("Email verified successfully!");

        navigate("/", {
          replace: true,
          state: {
            openAuthModal: true,
            authTab: "login",
            email: verifiedEmail,
          },
        });
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          getApiErrorMessage(
            error,
            "The verification link is invalid or expired.",
          ),
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="container margin-top-55 margin-bottom-55">
      <div className="row">
        <div className="col-md-12">
          <div className="verify-email-page">
            <div className="verify-email-container">
              {status === "loading" && (
                <>
                  <h2>Verifying Your Email</h2>
                  <p>Please wait while we verify your email address...</p>
                </>
              )}

              {status === "error" && (
                <>
                  <h2>Email Verification Failed</h2>

                  <p>{errorMessage}</p>

                  <p>
                    Please request a new verification email or contact us if the
                    problem persists.
                  </p>

                  <button
                    type="button"
                    className="button border"
                    onClick={() => navigate("/")}
                  >
                    Back to Home
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
