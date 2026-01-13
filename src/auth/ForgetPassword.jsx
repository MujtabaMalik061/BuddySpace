import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Loader from "../components/Loader";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/FirebaseConfig";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import Offline from "../components/Offline";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { isOnline } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success(
        "Password reset link sent! Check your email inbox or spam."
      );
      setEmail("");
      setIsSuccess(true);
    } catch (err) {
      setEmail("");
      setIsSuccess(false);
      console.error("Reset password error:", err);
      if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else {
        toast.error("Failed to send reset link. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOnline ? (
        <div className="login-page-overlay">
          <div className="login-card">
            {isSuccess ? (
              <>
                <div className="login-header">
                  <h1
                    style={{ textAlign: "start" }}
                    className="login-title font-15-20"
                  >
                    Reset Password
                  </h1>
                  <div className="forget-success-icon">
                    <span className="icon">
                      <Check size={30} />
                    </span>
                  </div>
                  <h1 className="login-title font-15-20">Email Sent!</h1>
                  <p className="login-subtitle font-12-16">
                    Check your email inbox or spam for a link to reset your
                    password.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="login-header">
                  <h1 className="login-title font-15-20">
                    Reset your password
                  </h1>
                  <p className="login-subtitle font-12-16">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="login-field">
                    <label className="login-label">Email</label>
                    <input
                      type="email"
                      className="login-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="login-submit-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader color="#fff" size="15" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </>
            )}
            <div className="login-footer">
              <button
                onClick={() => navigate("/signin")}
                className="forgot-back-signin-btn"
              >
                <span className="icon">
                  <ArrowLeft size={16} />
                </span>
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Offline />
      )}
    </>
  );
};

export default ForgetPassword;
