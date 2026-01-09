import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../assets/style/Auth.css";
import Loader from "../components/Loader";
import { IMAGES } from "../services/Constants";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/FirebaseConfig";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/workspaces");
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else if (err.code === "auth/invalid-credential") {
        toast.error("Invalid credential. Try again.");
      } else {
        toast.error("Failed to sign in. Try again.");
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
            <h1 className="login-title font-15-20">
              Welcome back to BuddySpace
            </h1>
            <p className="login-subtitle font-12-16">
              Sign in to continue collaborating with your team
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

            <div className="login-field">
              <div className="login-password-header">
                <label className="login-label">Password</label>
                <button
                  type="button"
                  className="login-forgot-link"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <div className="login-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              {loading ? <Loader color="#fff" size="15" /> : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don’t have an account?
              <button
                className="login-signup-link"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
