import React, { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [isSuccessfully, setIsSuccessfully] = useState(false);

  const handleSubmit = () => {
    if(!email) return toast.error("Email is required.")
    console.log("email---->", email);
    setEmail("");
    setIsSuccessfully(true);
    toast.success("Check you mail inbox to verify.")
  };

  return (
    <div onClick={onClose} className="modal-overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modal-content"
      >
        <h2 className="login-reset-title">Reset Password</h2>
        {isSuccessfully ? (
          <>
            <div className="login-reset-success">
              <span className="login-reset-success-icon">
                <Check />
              </span>

              <h3 className="login-reset-success-title">Email Sent!</h3>
            </div>

            <p className="login-reset-success-text">
              Check your email for a link to reset your password.
            </p>
          </>
        ) : (
          <>
            <p className="login-reset-text">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="login-reset-input"
            />

            <div className="login-reset-actions">
              <button onClick={handleSubmit} className="login-reset-submit">
                Send Reset Link
              </button>

              <button onClick={onClose} className="login-reset-cancel">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
