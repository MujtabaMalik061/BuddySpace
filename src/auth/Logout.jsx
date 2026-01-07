import React from "react";
import "../assets/style/Logout.css";
import { CircleX, LogOut, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const Logout = ({ onClose }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout. Try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content logout-modal">
        <div className="logout-icon">
          <TriangleAlert size={48} />
        </div>

        <h2 className="logout-title">Confirm Logout!!!</h2>

        <p className="logout-text">
          Are you sure you want to log out from the dashboard?
        </p>

        <div className="logout-actions">
          <button
            className="logout-action-btn logout-action-primary"
            onClick={onClose}
          >
            <span className="icon">
              <CircleX />
            </span>
            Cancel
          </button>
          <button
            onClick={logout}
            className="logout-action-btn logout-action-secondary"
          >
            <span className="icon">
              <LogOut />
            </span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
