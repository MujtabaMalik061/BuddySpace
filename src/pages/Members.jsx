import { useState } from "react";
import "../assets/style/Members.css";

import { UserPlus, MoreHorizontal, Mail, Shield, X } from "lucide-react";

const membersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    joinedAt: "Jan 2024",
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "Admin",
    joinedAt: "Feb 2024",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Member",
    joinedAt: "Feb 2024",
  },
];

const Members = () => {
  const [members, setMembers] = useState(membersData);
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="members-page-root">
      <div className="members-page-header">
        <div>
          <h1 className="members-page-title">Members</h1>
          <p className="members-page-subtitle">
            Manage workspace members and roles
          </p>
        </div>

        <button
          className="members-invite-btn"
          onClick={() => setShowInvite(true)}
        >
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

      {/* ===== Members Card ===== */}
      <div className="members-card">
        <div className="members-card-header">
          <Shield size={18} />
          <span>{members.length} Members</span>
        </div>

        <div className="members-card-body">
          {members.map((member) => (
            <div key={member.id} className="members-row">
              <div className="members-user">
                <div className="members-avatar">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="members-user-info">
                  <span className="members-user-name">{member.name}</span>
                  <span className="members-user-email">{member.email}</span>
                </div>
              </div>

              <div className="members-meta">
                <span
                  className={`members-role members-role-${member.role.toLowerCase()}`}
                >
                  {member.role}
                </span>

                <span className="members-joined">Joined {member.joinedAt}</span>

                {member.role !== "Owner" && (
                  <button className="members-action-btn">
                    <MoreHorizontal size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Invite Modal ===== */}
      {showInvite && (
        <div className="members-modal-backdrop">
          <div className="members-modal">
            <div className="members-modal-header">
              <h3>Invite Member</h3>
              <button onClick={() => setShowInvite(false)}>
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
                onClick={() => setShowInvite(false)}
              >
                Cancel
              </button>
              <button
                className="members-btn-primary"
                onClick={() => setShowInvite(false)}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
