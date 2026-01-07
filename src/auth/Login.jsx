import React, { useState } from "react";
import "../assets/style/Login.css";
import { IMAGES } from "../services/Constants";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";
import ResetPassword from "./ResetPassword";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForget, setIsForget] = useState(false);

  const handleLogin = () => {
    if (!email) return toast.error("Email is required!");
    if (!password) return toast.error("Password is required!");
    setLoading(true);
    setTimeout(() => {
      toast.success("Login successfully.");
      navigate("/");
      setLoading(false);
    }, 5000);
  };

  return (
    <div
      className="login-bg-container"
      style={{ backgroundImage: `url(${IMAGES.AuthBg})` }}
    >
      <div className="login-overlay">
        <div className="login-card">
          <div className="login-logo">
            <img src={IMAGES.SiteLogo} alt="logo" />
          </div>

          <h2 className="login-title">Welcome!</h2>
          <p className="login-subtitle">
            Sign in to your admin account to manage ContractorConnect
            marketplace. Monitor customers, Contractors, and jobs all in one
            place.
          </p>

          <div className="login-form">
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="login-options">
              <label className="login-checkbox">
                <input type="checkbox" />
                <span>Keep me logged in</span>
              </label>

              <span
                onClick={() => {
                  setIsForget(true);
                }}
                className="login-forgot"
              >
                Forgot Password?
              </span>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="login-button"
            >
              {loading ? <Loader color="#fff" /> : "Sign In"}
            </button>
          </div>
        </div>
      </div>
      {isForget && (
        <ResetPassword
          onClose={() => {
            setIsForget(false);
          }}
        />
      )}
    </div>
  );
};

export default Login;
