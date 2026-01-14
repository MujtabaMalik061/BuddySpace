import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Loader from "../components/Loader";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/FirebaseConfig";
import { generateCustomId } from "../utils/Helper";
import { toast } from "sonner";
import Offline from "../components/Offline";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { isOnline } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Confirm Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const customId = await generateCustomId("Users");
      await setDoc(doc(db, "Users", customId), {
        authId: user.uid,
        id: customId,
        fullName: name,
        fullNameLowerCase: name.toLowerCase(),
        email: email,
        role: "user",
        createdAt: new Date(),
      });
      toast.success("Login successfully.");
      navigate("/workspaces");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(getAuthErrorMessage(error));
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
                Create your BuddySpace account
              </h1>
              <p className="login-subtitle font-12-16">
                Start collaborating with your team today
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">Full Name</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <label className="login-label">Password</label>
                <div className="login-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    placeholder="Create a password"
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

              <div className="login-field">
                <label className="login-label">Confirm Password</label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >
                {loading ? <Loader color="#fff" size="15" /> : "Create Account"}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Already have an account?
                <button
                  className="login-signup-link"
                  onClick={() => navigate("/signin")}
                >
                  Sign in
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

export default SignUp;

export const getAuthErrorMessage = (error) => {
  if (!error?.code) return "Something went wrong. Please try again.";

  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Password should be at least 6 characters.";

    case "auth/operation-not-allowed":
      return "Email/password sign up is disabled.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/internal-error":
      return "An internal error occurred. Please try again.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    default:
      return "Signup failed. Please try again.";
  }
};
