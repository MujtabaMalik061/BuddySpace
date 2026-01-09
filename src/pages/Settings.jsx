import React, { useState, useEffect } from "react";
import { Camera, Eye, EyeOff, Lock, Palette, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "../assets/style/Settings.css";
import Loader from "../components/Loader";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../utils/FirebaseConfig";
import { toast } from "sonner";
import { ProfileByName } from "../utils/Helper";
import TopBar from "../components/TopBar";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  const [name, setName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPassword, setIsCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isNewPassword, setIsNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.fullName);
    }
  }, [currentUser]);

  const handleProfileUpdate = async () => {
    if (!currentUser) return;
    setLoading("UpdateProfile");
    try {
      const q = query(
        collection(db, "Users"),
        where("authId", "==", currentUser.uid)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        toast.error("User profile not found.");
        return;
      }

      const userDocRef = snap.docs[0].ref;

      await updateDoc(userDocRef, {
        fullName: name,
        fullNameLowerCase: name.toLowerCase(),
        updatedAt: new Date(),
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading("");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setLoading("UpdatePassword");
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        toast.error("No authenticated user.");
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Password update error:", error);

      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect.");
      } else if (error.code === "auth/weak-password") {
        toast.error("New password is too weak.");
      } else {
        toast.error("Failed to update password.");
      }
    } finally {
      setLoading("");
    }
  };

  return (
    <>
      <TopBar title="Settings" />
      <div className="page-root">
        <div className="settings-page-header">
          <h1 className="settings-page-title">Settings</h1>
          <p className="settings-page-subtitle">
            Manage your account preferences
          </p>
        </div>

        <section className="settings-section">
          <div className="settings-section-header">
            <Camera size={20} />
            <div>
              <h2 className="settings-section-title">Profile</h2>
              <p className="settings-section-description">
                Update your personal information
              </p>
            </div>
          </div>

          <div className="settings-avatar-row">
            <div className="settings-avatar">
              {ProfileByName(currentUser?.fullName)}
            </div>
            <div className="settings-avatar-actions">
              <button
                onClick={() => toast.success("This method in working.")}
                className="settings-outline-button"
              >
                <Camera size={16} /> Change Avatar
              </button>
              <p className="settings-hint">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          <div className="settings-divider" />
          <div className="settings-field">
            <label className="settings-label">Full Name</label>
            <input
              className="settings-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John doe"
            />
          </div>

          <div className="settings-field">
            <label className="settings-label">Email</label>
            <input
              className="settings-input"
              type="email"
              placeholder="john@example.com"
              value={currentUser?.email || "N/A"}
              readOnly
            />
          </div>

          <button
            disabled={loading !== ""}
            onClick={handleProfileUpdate}
            className="settings-primary-button"
          >
            {loading === "UpdateProfile" ? (
              <Loader color="#fff" size="15" />
            ) : (
              "Save Changes"
            )}
          </button>
        </section>

        {/* <section className="settings-section">
        <div className="settings-section-header">
          <Bell size={20} />
          <div>
            <h2 className="settings-section-title">Notifications</h2>
            <p className="settings-section-description">
              Configure how you receive notifications
            </p>
          </div>
        </div>

        <div className="settings-toggle-row">
          <div>
            <span className="settings-toggle-title">Email Notifications</span>
            <p className="settings-toggle-description">
              Receive email about new messages
            </p>
          </div>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="settings-divider" />

        <div className="settings-toggle-row">
          <div>
            <span className="settings-toggle-title">Push Notifications</span>
            <p className="settings-toggle-description">
              Get push notifications on your device
            </p>
          </div>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="settings-divider" />

        <div className="settings-toggle-row">
          <div>
            <span className="settings-toggle-title">Weekly Digest</span>
            <p className="settings-toggle-description">
              Weekly summary of workspace activity
            </p>
          </div>
          <input type="checkbox" />
        </div>
      </section> */}

        <section className="settings-section">
          <div className="settings-section-header">
            <Lock size={20} />
            <div>
              <h2 className="settings-section-title">Security</h2>
              <p className="settings-section-description">
                Manage your password and security settings
              </p>
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-label">Current Password</label>
            <div className="login-password-wrapper">
              <input
                className="login-input"
                type={isCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                onClick={() => {
                  setIsCurrentPassword(!isCurrentPassword);
                }}
                className="login-password-toggle"
              >
                {isCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="settings-grid-two">
            <div className="settings-field">
              <label className="settings-label">New Password</label>
              <div className="login-password-wrapper">
                <input
                  className="login-input"
                  type={isNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  onClick={() => {
                    setIsNewPassword(!isNewPassword);
                  }}
                  className="login-password-toggle"
                >
                  {isNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="settings-field">
              <label className="settings-label">Confirm Password</label>
              <div className="login-password-wrapper">
                <input
                  className="login-input"
                  type={isConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  onClick={() => {
                    setIsConfirmPassword(!isConfirmPassword);
                  }}
                  className="login-password-toggle"
                >
                  {isConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            disabled={loading !== ""}
            onClick={handlePasswordUpdate}
            className="settings-secondary-button"
          >
            {loading === "UpdatePassword" ? (
              <Loader size="15" />
            ) : (
              "Update Password"
            )}
          </button>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <Palette size={20} />
            <div>
              <h2 className="settings-section-title">Appearance</h2>
              <p className="settings-section-description">
                Customize how BuddySpace looks
              </p>
            </div>
          </div>

          <div className="settings-toggle-row">
            <div>
              <span className="settings-toggle-title">Dark Mode</span>
              <p className="settings-toggle-description">
                Switch between light and dark themes
              </p>
            </div>
            <input type="checkbox" value={theme} onChange={toggleTheme} />
          </div>
        </section>

        <section className="settings-section">
          <div
            style={{ color: "var(--error)" }}
            className="settings-section-header"
          >
            <Trash2 color="var(--error)" size={20} />
            <div>
              <h2 className="settings-section-title">Danger Zone</h2>
              <p className="settings-section-description">
                Irreversible actions for your workspace
              </p>
            </div>
          </div>
          <button
            style={{ background: "var(--error)" }}
            className="settings-primary-button"
          >
            Delete Workspace
          </button>
        </section>
      </div>
    </>
  );
};

export default Settings;
