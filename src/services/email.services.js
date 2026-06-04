export const workSpaceInvite = ({ currentUser, wsData }) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Workspace Invitation</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:40px 30px;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;">
                You're Invited 🎉
              </h1>
              <p style="margin:12px 0 0;color:#e9e7ff;font-size:16px;">
                Join a collaborative workspace and start working together.
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 35px;">
              <p style="margin:0 0 20px;font-size:16px;color:#374151;">
                Hello,
              </p>

              <p style="margin:0 0 20px;font-size:16px;line-height:28px;color:#4b5563;">
                <strong>${currentUser.fullName}</strong> has invited you to join
                the workspace:
              </p>

              <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:20px;margin-bottom:25px;">
                <h2 style="margin:0;color:#111827;font-size:22px;">
                  ${wsData.name}
                </h2>

                <p style="margin:10px 0 0;color:#6b7280;line-height:24px;">
                  ${wsData.description || "No description available."}
                </p>

                <div style="margin-top:15px;color:#6b7280;font-size:14px;">
                  👥 ${wsData.members.length} Members
                </div>
              </div>

              <div style="text-align:center;margin:35px 0;">
                <a
                  href="${import.meta.env.VITE_Frontend_URL}/workspaces?tab=invites"
                  style="
                    background:#4f46e5;
                    color:#ffffff;
                    text-decoration:none;
                    padding:15px 32px;
                    border-radius:10px;
                    display:inline-block;
                    font-size:16px;
                    font-weight:600;
                  "
                >
                  Accept Invitation
                </a>
              </div>

              <p style="margin:0;font-size:14px;color:#6b7280;line-height:24px;">
                If the button above doesn't work, copy and paste the following
                link into your browser:
              </p>

              <p style="margin-top:10px;font-size:14px;word-break:break-all;">
                <a href="${import.meta.env.VITE_Frontend_URL}/workspaces?tab=invites"
                   style="color:#4f46e5;">
                  ${import.meta.env.VITE_Frontend_URL}/workspaces?tab=invites
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:25px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:13px;">
                This invitation was sent by ${currentUser.fullName}
              </p>
              <p style="margin:8px 0 0;color:#9ca3af;font-size:13px;">
                © ${new Date().getFullYear()} Your Workspace Platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export const workspaceInviteAccepted = ({ invitedUser, workspace }) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;">
          
          <tr>
            <td align="center" style="background:#10b981;padding:40px;">
              <div style="font-size:60px;">✅</div>
              <h1 style="color:#fff;margin:10px 0 0;">
                Invitation Accepted
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#374151;">
                Great news!
              </p>

              <p style="font-size:16px;line-height:28px;color:#4b5563;">
                <strong>${invitedUser.fullName}</strong> has accepted your invitation
                and joined <strong>${workspace.name}</strong>.
              </p>

              <div style="background:#ecfdf5;padding:20px;border-radius:12px;border:1px solid #a7f3d0;">
                <p style="margin:0;color:#065f46;">
                  Your team is growing. You can now collaborate together inside the workspace.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:25px;background:#f9fafb;">
              <p style="color:#9ca3af;font-size:13px;margin:0;">
                Workspace Collaboration Platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export const workspaceInviteDeclined = ({ invitedUser, workspace }) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;">
          
          <tr>
            <td align="center" style="background:#ef4444;padding:40px;">
              <div style="font-size:60px;">❌</div>
              <h1 style="color:#fff;margin:10px 0 0;">
                Invitation Declined
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#374151;">
                Update regarding your invitation.
              </p>

              <p style="font-size:16px;line-height:28px;color:#4b5563;">
                <strong>${invitedUser.fullName}</strong> declined the invitation to join
                <strong>${workspace.name}</strong>.
              </p>

              <div style="background:#fef2f2;padding:20px;border-radius:12px;border:1px solid #fecaca;">
                <p style="margin:0;color:#991b1b;">
                  You can send another invitation later if needed.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:25px;background:#f9fafb;">
              <p style="color:#9ca3af;font-size:13px;margin:0;">
                Workspace Collaboration Platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export const collectionItemAddedEmail = ({ addedBy, workspace, item }) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#fff;border-radius:16px;overflow:hidden;">

          <tr>
            <td align="center"
              style="background:#3b82f6;padding:40px;">
              <div style="font-size:56px;">📚</div>
              <h1 style="margin:10px 0 0;color:#fff;">
                New Collection Item
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#374151;">
                <strong>${addedBy}</strong> added a new item to
                <strong>${workspace}</strong>.
              </p>

              <div style="
                margin-top:20px;
                padding:20px;
                background:#f8fafc;
                border:1px solid #e5e7eb;
                border-radius:12px;
              ">
                <h2 style="margin:0;color:#111827;">
                  ${item.title}
                </h2>

                <p style="margin-top:12px;color:#6b7280;">
                  ${item.description || "No description provided"}
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="
              padding:20px;
              background:#f9fafb;
              text-align:center;
            ">
              <p style="margin:0;color:#9ca3af;font-size:13px;">
                Workspace Collaboration Platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;