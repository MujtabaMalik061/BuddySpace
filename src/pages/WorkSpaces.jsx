import { useEffect, useState } from "react";
import "../assets/style/Workspaces.css";
import {
  Plus,
  Settings,
  ExternalLink,
  BadgePlus,
  BadgeX,
  BadgeCheck,
} from "lucide-react";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Tabs } from "../components/CustomComponents";
import {
  handleFtechWorkSpaces,
  joinPublicWorkSpace,
} from "../services/WorkSpaceHelper";
import { db } from "../utils/FirebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const WorkSpaces = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "private";
  const setTab = (newTab) => {
    setSearchParams({ tab: newTab });
  };
  const [workspaces, setWorkSpaces] = useState([]);
  const [declineLoading, setDeclineLoading] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(null);

  useEffect(() => {
    if (currentUser) {
      getWorkSpaces();
    } else {
      setLoading(false);
    }
  }, [tab, currentUser]);

  const getWorkSpaces = async () => {
    try {
      setLoading(true);
      const data = await handleFtechWorkSpaces(tab, currentUser?.id);
      setWorkSpaces(data);
    } finally {
      setLoading(false);
    }
  };

  const handlejoinPublicWorkSpace = async (workspaceId) => {
    if (!currentUser || !workspaceId) return;
    try {
      setJoinLoading(workspaceId);
      await joinPublicWorkSpace(workspaceId, currentUser?.id);
      getWorkSpaces();
    } finally {
      setJoinLoading(null);
    }
  };

  const handleDeclineInvite = async (inviteId) => {
    if (!inviteId) return;
    try {
      setDeclineLoading(inviteId);
      await deleteDoc(doc(db, "Invites", inviteId));
      setWorkSpaces((prev) => prev.filter((w) => w.id !== inviteId));
    } catch (err) {
      console.error("Decline invite error:", err);
    } finally {
      setDeclineLoading(null);
    }
  };

  const handleAcceptInvite = async (invite) => {
    if (!invite) return;
    try {
      setAcceptLoading(invite.id);
      const wsRef = doc(
        db,
        "WorkSpaces",
        invite.workSpace?.workSpaceId || invite.id,
      );
      const wsSnap = await getDoc(wsRef);
      if (!wsSnap.exists()) return console.error("Workspace not found");

      const wsData = wsSnap.data();
      if (!wsData.members.includes(currentUser.id)) {
        await updateDoc(wsRef, {
          members: [...wsData.members, currentUser.id],
        });
      }

      await deleteDoc(doc(db, "Invites", invite.id));

      setWorkSpaces((prev) => prev.filter((w) => w.id !== invite.id));
    } catch (err) {
      console.error("Accept invite error:", err);
    } finally {
      setAcceptLoading(null);
    }
  };

  const sortedWorkspaces = workspaces.sort((a, b) => {
    return b.createdAt.seconds - a.createdAt.seconds;
  });
  

  return (
    <>
      <TopBar title="Workspaces" />

      <div className="page-root padd-12-24">
        <div className="workspaces-page-header">
          <div>
            <h1 className="workspaces-page-title font-20-32">
              Your Workspaces
            </h1>
            <p className="workspaces-page-subtitle font-12-16">
              Manage and access your collaborative spaces
            </p>
          </div>

          <button
            onClick={() => {
              navigate("/create-workspace");
            }}
            className="workspaces-create-btn padd-duo-6-10-and-14-10 font-12-16"
          >
            <Plus size={16} />
            Create Workspace
          </button>
        </div>
        <Tabs
          activeTab={tab}
          setActiveTab={setTab}
          tabs={[
            { label: "My WorkSpaces", filter: "private" },
            { label: "Public WorkSpaces", filter: "public" },
            { label: "Invites", filter: "invites" },
          ]}
        />
        {loading ? (
          <div>
            <Loader size="60" style={{ height: "70vh", width: "100%" }} />
          </div>
        ) : tab === "invites" ? (
          sortedWorkspaces?.length > 0 ? (
            <div className="workspaces-grid">
              {sortedWorkspaces.map((workspace) => (
                <div key={workspace.id} className="workspaces-card padd-12-24">
                  <div className="workspaces-card-header">
                    <div>
                      <h3 className="workspaces-card-title elepsis">
                        {workspace?.workSpace?.name}
                      </h3>
                      <p className="workspaces-card-desc elepsis">
                        {workspace?.workSpace?.description}
                      </p>
                    </div>
                  </div>

                  <div className="workspaces-members">
                    <span className="workspaces-member-count">
                      {workspace?.workSpace?.members || 0} members
                    </span>
                  </div>
                  <div className="workspaces-members">
                    <span className="workspaces-member-count">
                      <strong style={{ color: "var(--text-primary)" }}>
                        InvitedBy:
                      </strong>{" "}
                      {workspace?.invitedBy?.email || "N/A"}
                    </span>
                  </div>

                  <div className="workspaces-action-btns">
                    <button
                      onClick={() => handleDeclineInvite(workspace.id)}
                      className="workspaces-open-btn workspaces-decline-btn"
                      disabled={acceptLoading || declineLoading}
                    >
                      {declineLoading === workspace.id ? (
                        <Loader size="16" color="white" />
                      ) : (
                        <>
                          <BadgeX size={16} /> Decline
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleAcceptInvite(workspace)}
                      className="workspaces-open-btn workspaces-accept-btn"
                      disabled={acceptLoading || declineLoading}
                    >
                      {acceptLoading === workspace.id ? (
                        <Loader size="16" color="white" />
                      ) : (
                        <>
                          <BadgeCheck size={16} /> Accept
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">No any Invite found</div>
          )
        ) : workspaces?.length > 0 ? (
          <div className="workspaces-grid">
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="workspaces-card padd-12-24">
                <div className="workspaces-card-header">
                  <div>
                    <h3 className="workspaces-card-title elepsis">
                      {workspace.name}
                    </h3>
                    <p className="workspaces-card-desc elepsis">
                      {workspace.description}
                    </p>
                  </div>
                  {currentUser?.id === workspace?.createdBy ? (
                    <button
                      onClick={() =>
                        navigate(`/workspace-settings/${workspace?.id}`)
                      }
                      className="workspaces-settings-btn"
                    >
                      <Settings size={16} />
                    </button>
                  ) : !workspace?.isPrivate &&
                    !workspace?.members?.includes(currentUser?.id) ? (
                    <button
                      onClick={() => handlejoinPublicWorkSpace(workspace?.id)}
                      className="workspaces-settings-btn"
                      disabled={joinLoading}
                    >
                      {joinLoading === workspace?.id ? (
                        <Loader size="10" color="var(--text-primary)" />
                      ) : (
                        <BadgePlus size={16} />
                      )}
                    </button>
                  ) : null}
                </div>

                <div className="workspaces-members">
                  <div className="workspaces-avatars">
                    {workspace?.memberNames.map((member, index) => (
                      <div key={index} className="workspaces-avatar">
                        {member[0]}
                      </div>
                    ))}

                    {workspace?.members?.length > 4 && (
                      <div className="workspaces-avatar-more">
                        +{workspace.members.length - 4}
                      </div>
                    )}
                  </div>

                  <span className="workspaces-member-count">
                    {workspace?.members?.length || 0} members
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigate(`/workspace/${workspace?.id}`);
                  }}
                  className="workspaces-open-btn"
                >
                  <ExternalLink size={16} />
                  Open Workspace
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">WorkSpaces not found</div>
        )}
      </div>
    </>
  );
};

export default WorkSpaces;
