import React, { useEffect, useState } from "react";
import { Lock, Trash2, AlertTriangle, FolderOpen } from "lucide-react";
import "../assets/style/Settings.css";
import Loader from "../components/Loader";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

import {
  fetchWorkspaceById,
  handleWorkSpaceUpdate,
  handleVisibilityUpdate,
  handleDeleteWorkspace,
} from "../services/WorkSpaceSettingsHelper";
import { toast } from "sonner";

const WorkSpaceSettings = () => {
  const { currentUser } = useAuth();
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState("fetching");
  const [workspace, setWorkspace] = useState(null);
  const [hasAccess, setHasAccess] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    fetchWorkSpace();
  }, [currentUser, workspaceId]);

  const fetchWorkSpace = async () => {
    if (!currentUser || !workspaceId) return;
    try {
      setLoading("fetching");

      await fetchWorkspaceById(
        workspaceId,
        currentUser,
        setWorkspace,
        setName,
        setDescription,
        setIsPrivate,
        setHasAccess
      );
    } finally {
      setLoading("");
    }
  };

  if (loading === "fetching") return <Loader/>

    if (!hasAccess) {
      return (
        <div className="no-access-wrapper">
          <div className="no-access-card">
            <AlertTriangle size={40} color="var(--error)" />
            <h2>No Access</h2>
            <p>You don’t have permission to view or manage this workspace.</p>
            <button
              onClick={() => navigate(-1)}
              className="settings-primary-button"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

  if (!workspace) {
    return (
      <div className="no-access-wrapper">
        <div className="no-access-card">
          <AlertTriangle size={40} color="var(--error)" />
          <h2>No WorkSpace Found</h2>
          <p>This WorkSpace not found yet. Try again later</p>
          <button
            onClick={() => navigate(-1)}
            className="settings-primary-button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar title="Settings" />

      <div className="page-root">
        <div className="settings-page-header">
          <h1 className="settings-page-title">Workspace Settings</h1>
          <p className="settings-page-subtitle">
            Manage your workspace preferences
          </p>
        </div>

        <section className="settings-section">
          <div className="settings-section-header">
            <FolderOpen size={20} />
            <div>
              <h2 className="settings-section-title">Workspace Info</h2>
              <p className="settings-section-description">
                Update workspace details
              </p>
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-label">Workspace Name</label>
            <input
              className="settings-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="settings-field">
            <label className="settings-label">Description</label>
            <textarea
              className="settings-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            disabled={loading !== ""}
            onClick={() =>
              handleWorkSpaceUpdate(workspaceId, setLoading, name, description)
            }
            className="settings-primary-button"
          >
            {loading === "UpdateProfile" ? (
              <Loader color="#fff" size="15" />
            ) : (
              "Save Changes"
            )}
          </button>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <Lock size={20} />
            <div>
              <h2 className="settings-section-title">Visibility</h2>
              <p className="settings-section-description">
                Control workspace privacy
              </p>
            </div>
          </div>

          <div className="settings-toggle-row">
            <div>
              <span className="settings-toggle-title">Private Workspace</span>
              <p className="settings-toggle-description">
                Only invited members can see this workspace
              </p>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
            />
          </div>

          <button
            disabled={loading !== ""}
            onClick={() =>
              handleVisibilityUpdate(workspaceId, setLoading, isPrivate)
            }
            className="settings-secondary-button"
          >
            {loading === "UpdateVisibility" ? (
              <Loader size="15" />
            ) : (
              "Update Visibility"
            )}
          </button>
        </section>

        {/* ===== Danger Zone ===== */}
        <section className="settings-section">
          <div
            style={{ color: "var(--error)" }}
            className="settings-section-header"
          >
            <Trash2 color="var(--error)" size={20} />
            <div>
              <h2 className="settings-section-title">Danger Zone</h2>
              <p className="settings-section-description">
                Irreversible actions
              </p>
            </div>
          </div>

          <button
            onClick={() => handleDeleteWorkspace(workspaceId, navigate)}
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

export default WorkSpaceSettings;
