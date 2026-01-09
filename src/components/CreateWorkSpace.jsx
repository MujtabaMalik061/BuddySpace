import React, { useState } from "react";
import { FolderOpen, Lock, Trash2 } from "lucide-react";
import "../assets/style/Settings.css";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { handleCreateWorkSpace } from "../services/WorkSpaceHelper";
import { toast } from "sonner";

const CreateWorkSpace = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const CreateWorkSpace = async () => {
    if (!name) return toast.error("Name is required!!");
    if (!description) return toast.error("Name is required!!");
    if (!currentUser) return toast.error("Your id not found");
    try {
      setLoading(true);
      await handleCreateWorkSpace(
        currentUser?.id,
        name,
        description,
        isPrivate
      );
      navigate("/workspaces");
      toast.success("WorkSpace created successfully.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-root">
        <div className="settings-page-header">
          <h1 className="settings-page-title">Create WorkSpace</h1>
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
                Add workspace details
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
          </section>
          <button
            disabled={loading}
            onClick={CreateWorkSpace}
            className="settings-primary-button"
          >
            {loading ? (
              <Loader color="#fff" style={{ width: "130px" }} size="15" />
            ) : (
              "Create workspace"
            )}
          </button>
        </section>
      </div>
    </>
  );
};

export default CreateWorkSpace;
