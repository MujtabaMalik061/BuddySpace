import React, { useState, useEffect, useRef } from "react";
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
import { Selector } from "../components/CustomComponents";

const Settings = () => {
  const { theme, toggleTheme, setImageMode, imageMode } = useTheme();
  const { currentUser, loading } = useAuth();
  const [loadingType, setLoadingType] = useState("");

  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);

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
    setLoadingType("UpdateProfile");
    try {
      let avatarUrl = currentUser.avatarUrl || "";
      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", avatarFile);
        formData.append("userId", currentUser.uid);

        const res = await fetch(
          `${import.meta.env.VITE_IMAGE_BACKEND}/addImage`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to upload avatar");

        avatarUrl = data.url;
      }

      const q = query(
        collection(db, "Users"),
        where("authId", "==", currentUser.uid),
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
        profileImage: avatarUrl || currentUser?.profileImage || "",
        updatedAt: new Date(),
      });

      toast.success("Profile updated successfully!");
      // setAvatarFile(null);
      // setAvatarPreview("");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoadingType("");
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
    setLoadingType("UpdatePassword");
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        toast.error("No authenticated user.");
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
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
      setLoadingType("");
    }
  };

  return (
    <>
      <TopBar title="Settings" />
      <div className="page-root padd-12-24">
        <div className="settings-page-header mar-b-14-20">
          <h1 className="settings-page-title font-15-20">Settings</h1>
          <p className="settings-page-subtitle font-12-16">
            Manage your account preferences
          </p>
        </div>

        <section className="settings-section padd-12-24">
          <div className="settings-section-header">
            <Camera size={20} />
            <div>
              <h2 className="settings-section-title font-14-18">Profile</h2>
              <p className="settings-section-description font-12-16">
                Update your personal information
              </p>
            </div>
          </div>

          <div className="settings-avatar-row">
            <div className="settings-avatar icon-40-80  font-15-20">
              {loading ? (
                <Loader color="#fff" size="18" />
              ) : avatarPreview ? (
                <img
                  src={avatarPreview}
                  style={{ objectFit: imageMode }}
                  alt="Avatar Preview"
                />
              ) : currentUser?.profileImage ? (
                <img
                  src={currentUser?.profileImage}
                  style={{ objectFit: imageMode }}
                  alt="Avatar"
                />
              ) : (
                ProfileByName(currentUser?.fullName)
              )}
            </div>
            <div className="settings-avatar-actions">
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />

              <button
                onClick={() => fileInputRef.current.click()}
                className="settings-outline-button padd-duo-6-10-and-14-10"
              >
                <Camera size={16} /> Change Avatar
              </button>
              <p className="settings-hint">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          <div className="settings-divider mar-duo-15-30-and-0" />
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
              onClick={() => toast.error("Not allow to change.")}
              readOnly
            />
          </div>

          <button
            disabled={loadingType !== ""}
            onClick={handleProfileUpdate}
            className="settings-primary-button mar-t-12-18"
          >
            {loadingType === "UpdateProfile" ? (
              <Loader color="#fff" size="15" />
            ) : (
              "Save Changes"
            )}
          </button>
        </section>

        <section className="settings-section padd-12-24">
          <div className="settings-section-header">
            <Lock size={20} />
            <div>
              <h2 className="settings-section-title font-14-18">Security</h2>
              <p className="settings-section-description font-12-16">
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
            disabled={loadingType !== ""}
            onClick={handlePasswordUpdate}
            className="settings-secondary-button mar-t-12-18"
          >
            {loadingType === "UpdatePassword" ? (
              <Loader size="15" />
            ) : (
              "Update Password"
            )}
          </button>
        </section>

        <section className="settings-section padd-12-24">
          <div className="settings-section-header">
            <Palette size={20} />
            <div>
              <h2 className="settings-section-title font-14-18">Appearance</h2>
              <p className="settings-section-description font-12-16">
                Customize how BuddySpace looks
              </p>
            </div>
          </div>
          <div
            className="settings-transfer-owner-field mar-b-14-20"
            style={{ marginBottom: "20px" }}
          >
            <Selector
              filter={imageMode}
              setFilter={setImageMode}
              options={[
                { label: "Cover", filter: "cover" },
                { label: "Contain", filter: "contain" },
              ]}
            />
          </div>
          <div className="settings-toggle-row">
            <div>
              <span className="settings-toggle-title font-14-18">
                Dark Mode
              </span>
              <p className="settings-toggle-description font-12-16">
                Switch between light and dark themes
              </p>
            </div>
            <input type="checkbox" value={theme} onChange={toggleTheme} />
          </div>
        </section>
      </div>
    </>
  );
};

export default Settings;
