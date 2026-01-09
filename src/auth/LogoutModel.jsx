import React from "react";
import { CircleX, LogOut, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const LogoutModel = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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

        <h2 className="logout-title font-20-32">Confirm Logout!!!</h2>

        <p className="logout-text font-15-20">
          Are you sure you want to log out from the dashboard?
        </p>

        <div className="logout-actions">
          <button
            className="logout-action-btn logout-action-primary padd-duo-10-14-and-14-28"
            onClick={onClose}
          >
            <span className="btn-icon">
              <CircleX />
            </span>
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="logout-action-btn logout-action-secondary padd-duo-10-14-and-14-28"
          >
            <span className="btn-icon">
              <LogOut />
            </span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModel;
