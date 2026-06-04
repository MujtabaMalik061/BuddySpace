import { useEffect, useState } from "react";
import "../assets/style/Members.css";
import { UserPlus, MoreHorizontal, Mail, Shield, X } from "lucide-react";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import { IconSelector, SearchInput } from "../components/CustomComponents";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/FirebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { generateCustomId, ProfileByName } from "../utils/Helper";
import { useTheme } from "../context/ThemeContext";
import { handleSendNotification } from "../utils/extensions/Notification.extensions";
import { workSpaceInvite } from "../services/email.services";

const Members = () => {
  const { imageMode } = useTheme();
  const { currentUser, selectedWorkSpace: storedWorkspace } = useAuth();

  const selectedWorkSpaceId =
    storedWorkspace?.workspaceId || storedWorkspace?.id;

  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedWorkSpaceId) return;
    fetchMembers();
  }, [selectedWorkSpaceId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const wsRef = doc(db, "WorkSpaces", selectedWorkSpaceId);
      const wsSnap = await getDoc(wsRef);
      if (!wsSnap.exists()) return;

      const wsData = wsSnap.data();

      const memberIds = wsData.members || [];
      const membersData = await Promise.all(
        memberIds.map(async (userId) => {
          const userRef = doc(db, "Users", userId);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) return null;

          const data = userSnap.data();

          return {
            id: userId,
            profileImage: data.profileImage,
            name: data.fullName,
            email: data.email,
            role: userId === wsData.createdBy ? "Admin" : "Member",
            joinedAt: data.createdAt?.toDate().toLocaleDateString() || "-",
          };
        }),
      );

      setMembers(membersData);
    } catch (err) {
      console.error("Fetch members error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!email.trim()) return alert("Email is required");

    setInviteLoading(true);
    try {
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("email", "==", email.trim()));
      const querySnap = await getDocs(q);

      if (querySnap.empty) return toast.error("User not found");

      const userDoc = querySnap.docs[0];
      const userId = userDoc.id;

      const wsRef = doc(db, "WorkSpaces", selectedWorkSpaceId);
      const wsSnap = await getDoc(wsRef);
      if (!wsSnap.exists()) return toast.error("Workspace not found");

      const wsData = wsSnap.data();
      if (wsData.members.includes(userId))
        return toast.error("User already existing");
      const customId = await generateCustomId("Invites");
      const inviteRef = doc(db, "Invites", customId);
      await setDoc(inviteRef, {
        invitedBy: {
          email: currentUser.email,
          userId: currentUser.id,
        },
        invitedUser: {
          email: email.trim(),
          userId,
        },
        workSpace: {
          workSpaceId: wsData.workspaceId,
          name: wsData.name,
          description: wsData.description,
          createdAt: wsData.createdAt?.toDate() || new Date(),
          members: wsData.members.length,
        },
        inviteId: customId,
        createdAt: Timestamp.now(),
      });
      const inviteMailContent = workSpaceInvite({ currentUser, wsData });
      handleSendNotification({
        title: "Workspace Invitation",
        body: `You have been invited to join the workspace ${wsData.name} by ${currentUser.fullName}`,
        link: "/workspaces?tab=invites",
        subject: "Workspace Invitation",
        htmlContent: inviteMailContent,
        userIds: [userId],
        isByAuth: false,
        checkType: "activity",
      });

      toast.success("Invite sent successfully");
      setShowInvite(false);
      setEmail("");
    } catch (err) {
      setShowInvite(false);
      setEmail("");
      console.error("Invite error:", err);
      toast.error("Failed to send invite");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      setInviteLoading(true);
      const wsRef = doc(db, "WorkSpaces", selectedWorkSpaceId);
      await updateDoc(wsRef, {
        members: members.filter((m) => m.id !== userId).map((m) => m.id),
      });

      setMembers((prev) => prev.filter((m) => m.id !== userId));
      toast.success("Member removed successfully");
    } catch (err) {
      console.error("Remove member error:", err);
      toast.error("Failed to remove member");
    } finally {
      setInviteLoading(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    const query = search.toLowerCase();

    return (
      member?.name?.toLowerCase().includes(query) ||
      member?.email?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <TopBar title="Members" />
      <div className="page-root">
        <div className="members-page-header">
          <div>
            <h1 className="members-page-title">Members</h1>
            <p className="members-page-subtitle">
              Manage workspace members and roles
            </p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="workspace-detail-btn-secondary"
            disabled={loading}
          >
            <UserPlus size={16} />
            Invite Members
          </button>
        </div>
        <SearchInput
          value={search}
          setValue={setSearch}
          placeholder="Search members..."
          margin="20px 0"
        />
        {loading ? (
          <div className="members-card no-data">
            <Loader />
          </div>
        ) : (
          <div className="members-card">
            <div className="members-card-header">
              <h3>
                <Shield size={18} color="#3c83f6" />
                <span>{filteredMembers.length} Members</span>
              </h3>
            </div>

            <div className="members-card-body">
              {filteredMembers.map((member) => (
                <div key={member?.id} className="members-row">
                  <div className="members-user">
                    <div className="members-avatar">
                      {member?.profileImage ? (
                        <img
                          src={member?.profileImage}
                          alt="Avatar"
                          style={{ objectFit: imageMode }}
                        />
                      ) : (
                        ProfileByName(member?.name || "N/A")
                      )}
                    </div>

                    <div className="members-user-info">
                      <span className="members-user-name">
                        {member?.name || "N/A"}
                      </span>
                      <span className="members-user-email">
                        {member?.email || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="members-meta">
                    <span
                      className={`members-role members-role-${member?.role?.toLowerCase()}`}
                    >
                      {member?.role || "N/A"}
                    </span>

                    <span className="members-joined">
                      Joined {member?.joinedAt || "N/A"}
                    </span>

                    {member?.role === "Member" &&
                      currentUser.id === storedWorkspace?.createdBy && (
                        <IconSelector
                          icon={<MoreHorizontal size={16} />}
                          options={[
                            {
                              label: "Remove Member",
                              icon: X,
                              action: () => handleRemoveUser(member.id),
                            },
                          ]}
                        />
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showInvite && (
        <div className="members-modal-backdrop">
          <div className="members-modal">
            <div className="members-modal-header">
              <h3>Invite Member</h3>
              <button
                disabled={inviteLoading}
                onClick={() => setShowInvite(false)}
              >
                <X size={18} />
              </button>
            </div>

            <p className="members-modal-desc">
              Send an invitation to join this workspace
            </p>

            <label className="members-label">Email Address</label>
            <div className="members-input-wrapper">
              <Mail size={16} />
              <input
                type="email"
                className="members-input"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="members-modal-actions">
              <button
                className="members-btn-secondary"
                disabled={inviteLoading}
                onClick={() => setShowInvite(false)}
              >
                Cancel
              </button>
              <button
                className="members-btn-primary"
                onClick={handleInviteUser}
                disabled={inviteLoading}
              >
                {inviteLoading ? (
                  <Loader color="#fff" size="14" style={{ width: "74px" }} />
                ) : (
                  "Send Invite"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Members;
