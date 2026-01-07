import React,{ useState, useEffect } from "react";
import { Camera, Lock, Palette, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "../assets/style/Settings.css";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../utils/FirebaseConfig";


const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const [isDeleted, setIsDeleted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.fullName);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

const handleProfileUpdate = async () => {
  if (!currentUser) return;

  try {
    // 🔍 find user doc by authId
    const q = query(
      collection(db, "Users"),
      where("authId", "==", currentUser.uid)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      alert("User profile not found.");
      return;
    }

    const userDocRef = snap.docs[0].ref;

    await updateDoc(userDocRef, {
      fullName: name,
      fullNameLowerCase: name.toLowerCase(),
      email: email,
      updatedAt: new Date(),
    });

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Profile update error:", error);
    alert("Failed to update profile.");
  }
};

const handlePasswordUpdate = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Please fill all password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match.");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      alert("No authenticated user.");
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

    alert("Password updated successfully!");
  } catch (error) {
    console.error("Password update error:", error);

    if (error.code === "auth/wrong-password") {
      alert("Current password is incorrect.");
    } else if (error.code === "auth/weak-password") {
      alert("New password is too weak.");
    } else {
      alert("Failed to update password.");
    }
  }
};


  return (
    <div className="settings-page-root">
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
          <div className="settings-avatar">JD</div>
          <div className="settings-avatar-actions">
            <button className="settings-outline-button">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={handleProfileUpdate}
          className="settings-primary-button"
        >
          Save Changes
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
          <input
            className="settings-input"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="settings-grid-two">
          <div className="settings-field">
            <label className="settings-label">New Password</label>
            <input
              className="settings-input"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="settings-field">
            <label className="settings-label">Confirm Password</label>
            <input
              className="settings-input"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handlePasswordUpdate}
          className="settings-secondary-button"
        >
          Update Password
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
  );
};

export default Settings;
