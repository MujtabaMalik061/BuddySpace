import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../assets/style/Auth.css";
import Loader from "../components/Loader";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/FirebaseConfig";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import Offline from "../components/Offline";

const Login = () => {
  const navigate = useNavigate();
  const { isOnline } = useAuth();
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
      toast.error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOnline ? (
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
      ) : (
        <Offline />
      )}
    </>
  );
};

export default Login;

export const getAuthErrorMessage = (error) => {
  if (!error?.code) return "Something went wrong. Please try again.";

  switch (error.code) {
    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/invalid-credential":
      return "Invalid email or password.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    default:
      return "Failed to sign in. Please try again.";
  }
};
