import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  BadgePlus,
  ChevronDown,
  ChevronUp,
  LogOut,
  SendHorizonal,
  Settings,
} from "lucide-react";
import TopBar from "./TopBar";
import Loader from "./Loader";
import { BackBtn } from "./CustomComponents";
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
import { toast } from "sonner";

const WorkSpaceDetails = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { workspaceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(null);
  const [comment, setComment] = useState("");
  const [isComment, setIsComment] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);
  const [isCommentActive, setIsCommentActive] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
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

  const handleSendComment = async () => {
    if (!comment) return toast.error("comment is required!!");
    setIsCommentActive(true);
    setTimeout(() => {
      setIsCommentLoading(true);
      setIsCommentActive(false);
    }, 800);
    try {
      await addCommentToWorkSpace(workspaceId, currentUser, comment);
      setComment("");
      toast.success("comment added sucessfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsCommentLoading(false);
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

      <div className="workspace-detail-root">
        <BackBtn title="Back to Workspaces" onBack="/workspaces" />
        {loading ? (
          <Loader style={{ height: "60vh", width: "100%" }} />
        ) : (
          <>
            <div className="workspace-detail-card">
              <div className="workspace-detail-header">
                <div className="workspace-detail-header-info">
                  <h1 className="workspace-detail-title">
                    {workSpaceDetails?.name}
                  </h1>
                  <p className="workspace-detail-subtitle">
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
              <div className="workspace-detail-line-data-container">
                <div className="workspace-detail-line-data">
                  <strong>Members</strong>
                  <span className="straight-line"></span>
                  <strong>{workSpaceDetails?.members?.length}</strong>
                </div>
                <div className="workspace-detail-line-data">
                  <strong>Created At</strong>
                  <span className="straight-line"></span>
                  <strong>{formateDate(workSpaceDetails?.createdAt)}</strong>
                </div>
              </div>
            </div>
            <div className="workspace-detail-card">
              <div className="workspace-detail-comment-header-container">
                <div className="workspace-detail-comment-header">
                  <h3>Comments</h3>
                  <button
                    onClick={() => {
                      setIsComment(!isComment);
                    }}
                    className="comment-post-btn"
                  >
                    Post
                    <span className="icon">
                      {isComment ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </span>
                  </button>
                </div>
                {isComment && (
                  <div className="write-comment-container">
                    <div className="settings-field">
                      <label className="settings-label">Write a Comment</label>
                      <textarea
                        className="settings-textarea"
                        placeholder="Write your Comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleSendComment}
                      className={`${
                        isCommentActive ? "active" : ""
                      } comment-send-btn`}
                    >
                      {isCommentLoading ? (
                        <Loader color="#fff" size="24" />
                      ) : (
                        <>
                          Send Comment
                          <span className="icon">
                            <SendHorizonal />
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="workspace-detail-comments-container">
                {workSpaceDetails?.comments?.length > 0 ? (
                  [...workSpaceDetails.comments]
                    .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                    .map((comment, index) => (
                      <div key={index} className="workspace-comment-card">
                        <div className="workspace-comment-header">
                          <strong>
                            {comment.createdBy?.name || "Anonymous"}
                          </strong>
                          <span className="workspace-comment-date">
                            {formateDate(comment?.createdAt)}
                          </span>
                        </div>
                        <p className="workspace-comment-body">
                          {comment.comment}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="no-data">No Comments found.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WorkSpaceDetails;
