import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import { generateCustomId, getUserNameById } from "../utils/Helper";
import { toast } from "sonner";

export const handleCreateWorkSpace = async (
  userId,
  name,
  description,
  isPrivate,
  isDevMode,
) => {
  try {
    const customId = await generateCustomId("WorkSpaces");

    const workspaceData = {
      workspaceId: customId,
      createdBy: userId,
      name,
      description,
      isPrivate: !!isPrivate,
      isDevMode: !!isDevMode,
      createdAt: serverTimestamp(),
      members: [userId],
    };
    await setDoc(doc(db, "WorkSpaces", customId), workspaceData);

    return customId;
  } catch (error) {
    console.error("Create workspace error:", error);
    throw error;
  }
};

export const handleFtechWorkSpaces = async (tab, userId) => {
  try {
    let q;
    let snap;

    if (tab === "private") {
      q = query(
        collection(db, "WorkSpaces"),
        where("members", "array-contains", userId)
      );
    } else if (tab === "public") {
      q = query(collection(db, "WorkSpaces"), where("isPrivate", "==", false));
    } else if (tab === "invites") {
      q = query(
        collection(db, "Invites"),
        where("invitedUser.userId", "==", userId)
      );
    } else {
      return [];
    }

    snap = await getDocs(q);

    const workspaces = await Promise.all(
      snap.docs.map(async (docSnap) => {
        const data = docSnap.data();
        let memberNames = [];
        if (data.members?.length) {
          const firstFourMembers = data.members.slice(0, 4);
          memberNames = await Promise.all(
            firstFourMembers.map((memberId) => getUserNameById(memberId))
          );
        }

        return {
          id: docSnap.id,
          ...data,
          memberNames: memberNames.filter(Boolean),
        };
      })
    );

    return workspaces;
  } catch (error) {
    console.error("Fetch workspaces error:", error);
    return [];
  }
};

export const joinPublicWorkSpace = async (workspaceId, userId) => {
  if (!workspaceId || !userId) return;

  try {
    const workspaceRef = doc(db, "WorkSpaces", workspaceId);
    const snap = await getDoc(workspaceRef);

    if (!snap.exists()) {
      toast.error("Workspace not found");
      return;
    }

    const data = snap.data();
    if (data.isPrivate) {
      toast.error("This workspace is private");
      return;
    }
    if (data.members?.includes(userId)) {
      toast.info("You are already a member");
      return;
    }
    await updateDoc(workspaceRef, {
      members: arrayUnion(userId),
    });

    toast.success("Joined workspace successfully!");
  } catch (error) {
    console.error("Join workspace error:", error);
    toast.error("Failed to join workspace");
  }
};

export const handleDropWorkSpace = async (workSpaceId, currentUserId) => {
  if (!workSpaceId || !currentUserId) return;

  try {
    const wsRef = doc(db, "WorkSpaces", workSpaceId);
    const wsSnap = await getDoc(wsRef);

    if (!wsSnap.exists()) {
      console.error("Workspace not found");
      return;
    }

    const wsData = wsSnap.data();
    if (!wsData.members.includes(currentUserId)) {
      console.warn("User is not a member of this workspace");
      return;
    }
    const updatedMembers = wsData.members.filter((id) => id !== currentUserId);

    await updateDoc(wsRef, {
      members: updatedMembers,
    });

    console.log("You have successfully left the workspace");
    toast.success("You have successfully left the workspace");
  } catch (err) {
    console.error("Error dropping workspace:", err);
    toast.error("Failed to left the workspace");
  }
};
