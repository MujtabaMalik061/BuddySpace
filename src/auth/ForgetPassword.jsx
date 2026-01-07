import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/FirebaseConfig";
import { IMAGES } from "../services/Constants";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);

      setMessage("Password reset link sent! Check your email.");
    } catch (err) {
      console.error("Reset password error:", err);

      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("Failed to send reset link. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${IMAGES.AuthBg})` }}
      className="login-page-root"
    >
      <div className="login-page-overlay">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Reset your password</h1>
            <p className="login-subtitle">
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

            {message && <p className="login-success">{message}</p>}
            {error && <p className="login-error">{error}</p>}

            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

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
    </div>
  );
};

export default ForgetPassword;
