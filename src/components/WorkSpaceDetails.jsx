import {  useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  BadgePlus,
  LogOut,
  Settings,
} from "lucide-react";
import TopBar from "./TopBar";
import Loader from "./Loader";
import { BackBtn, CommentsArea } from "./CustomComponents";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  addCommentToWorkSpace,
  listenWorkSpaceDetailsById,
} from "../services/WorkSpaceSettingsHelper";
import {
  joinPublicWorkSpace,
  handleDropWorkSpace,
} from "../services/WorkSpaceHelper";
import { formateDate } from "../utils/Helper";

const WorkSpaceDetails = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { workspaceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(null);
  const [comment, setComment] = useState("");
  const [hasAccess, setHasAccess] = useState(true);
  const [workSpaceDetails, setWorkSpaceDetails] = useState(null);

  useEffect(() => {
    if (!currentUser || !workspaceId) return;
    setLoading(true);
    const unsubscribe = listenWorkSpaceDetailsById(
      workspaceId,
      currentUser,
      (workspaceData) => {
        setWorkSpaceDetails(workspaceData);
        setLoading(false);
      },
      (access) => {
        setHasAccess(access);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, workspaceId]);

  const DropWorkSpace = async () => {
    if (!workspaceId || !currentUser) return;

    try {
      setLeaveLoading(true);
      await handleDropWorkSpace(workspaceId, currentUser?.id);
      navigate("/workspaces");
    } finally {
      setLeaveLoading(false);
    }
  };

  const handlejoinPublicWorkSpace = async () => {
    if (!currentUser || !workspaceId) return;

    try {
      setJoinLoading(workspaceId);
      await joinPublicWorkSpace(workspaceId, currentUser?.id);
    } finally {
      setJoinLoading(null);
    }
  };

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

  return (
    <>
      <TopBar title="Workspace Details" />

      <div className="workspace-detail-root padd-12-24">
        <BackBtn title="Back to Workspaces" onBack="/workspaces" />
        {loading ? (
          <Loader style={{ height: "60vh", width: "100%" }} />
        ) : (
          <>
            <div className="workspace-detail-card mar-t-20-40 padd-10-20">
              <div className="workspace-detail-header">
                <div className="workspace-detail-header-info">
                  <h1 className="workspace-detail-title font-15-20">
                    {workSpaceDetails?.name}
                  </h1>
                  <p className="workspace-detail-subtitle font-12-16">
                    {workSpaceDetails?.description}
                  </p>
                </div>
                {currentUser?.id === workSpaceDetails?.createdBy ? (
                  <button
                    onClick={() =>
                      navigate(`/workspace-settings/${workSpaceDetails?.id}`)
                    }
                    className="workspaces-settings-btn"
                  >
                    <Settings size={16} />
                  </button>
                ) : !workSpaceDetails?.isPrivate &&
                  !workSpaceDetails?.members?.includes(currentUser?.id) ? (
                  <button
                    onClick={() =>
                      handlejoinPublicWorkSpace(workSpaceDetails?.id)
                    }
                    className="workspaces-settings-btn"
                    disabled={joinLoading}
                  >
                    {joinLoading === workSpaceDetails?.id ? (
                      <Loader size="10" color="var(--text-primary)" />
                    ) : (
                      <BadgePlus size={16} />
                    )}
                  </button>
                ) : workSpaceDetails?.members?.includes(currentUser?.id) ? (
                  <button
                    onClick={DropWorkSpace}
                    className="workspaces-settings-btn"
                    disabled={leaveLoading}
                  >
                    {leaveLoading ? (
                      <Loader size="16" color="var(--text-primary)" />
                    ) : (
                      <LogOut size={16} />
                    )}
                  </button>
                ) : null}
              </div>
              <div className="workspace-detail-line-data-container mar-t-20-40">
                <div className="workspace-detail-line-data font-12-16">
                  <strong>Members</strong>
                  <span className="straight-line"></span>
                  <strong>{workSpaceDetails?.members?.length}</strong>
                </div>
                <div className="workspace-detail-line-data font-12-16">
                  <strong>Created At</strong>
                  <span className="straight-line"></span>
                  <strong>{formateDate(workSpaceDetails?.createdAt)}</strong>
                </div>
              </div>
            </div>
            <CommentsArea
              comments={workSpaceDetails?.comments}
              setComment={setComment}
              comment={comment}
              AtSubmit={() =>
                addCommentToWorkSpace(workspaceId, currentUser, comment)
              }
            />
          </>
        )}
      </div>
    </>
  );
};

export default WorkSpaceDetails;
