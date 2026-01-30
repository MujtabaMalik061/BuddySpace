import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import { toast } from "sonner";

export const fetchWorkspaceById = async (
  workspaceId,
  currentUser,
  setWorkspace,
  setName,
  setDescription,
  setIsPrivate,
  setHasAccess,
) => {
  try {
    const ref = doc(db, "WorkSpaces", workspaceId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      setHasAccess(false);
      return;
    }

    const data = snap.data();
    if (data.createdBy !== currentUser.id) {
      setHasAccess(false);
      return;
    }

    setWorkspace({ id: snap.id, ...data });
    setName(data.name || "");
    setDescription(data.description || "");
    setIsPrivate(!!data.isPrivate);
  } catch (err) {
    console.error("Fetch workspace error:", err);
    setHasAccess(false);
  }
};

export const handleWorkSpaceUpdate = async (
  workspaceId,
  setLoading,
  name,
  description,
  fetchWorkSpaces,
) => {
  if (!workspaceId) return;

  setLoading("UpdateProfile");
  try {
    await updateDoc(doc(db, "WorkSpaces", workspaceId), {
      name,
      description,
      updatedAt: new Date(),
    });
    fetchWorkSpaces();
    toast.success("Workspace updated successfully!");
  } catch (error) {
    console.error("Workspace update error:", error);
    toast.error("Failed to update workspace.");
  } finally {
    setLoading("");
  }
};

export const handleVisibilityUpdate = async (
  workspaceId,
  setLoading,
  isPrivate,
) => {
  if (!workspaceId) return;

  setLoading("UpdateVisibility");
  try {
    await updateDoc(doc(db, "WorkSpaces", workspaceId), {
      isPrivate,
      updatedAt: new Date(),
    });
    toast.success("Visibility updated!");
  } catch (error) {
    console.error("Visibility update error:", error);
    toast.error("Failed to update visibility.");
  } finally {
    setLoading("");
  }
};

export const handleDeleteWorkspace = async (
  workspaceId,
  navigate,
  fetchWorkSpaces,
) => {
  if (!workspaceId) return;

  const confirmDelete = window.confirm(
    "Are you sure? This action cannot be undone.",
  );
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "WorkSpaces", workspaceId));
    toast.success("Workspace deleted!");
    fetchWorkSpaces();
    navigate("/workspaces");
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Failed to delete workspace.");
  }
};

export const getWorkSpaceDetailsById = async (currentUser, workspaceId) => {
  if (!currentUser || !workspaceId) return { error: "Invalid request" };

  try {
    const workspaceRef = doc(db, "WorkSpaces", workspaceId);
    const workspaceSnap = await getDoc(workspaceRef);

    if (!workspaceSnap.exists()) {
      return { error: "Workspace not found" };
    }

    const workspaceData = workspaceSnap.data();

    const isMember =
      workspaceData.members?.some((memberId) => memberId === currentUser) ||
      workspaceData.createdBy === currentUser.id;

    if (!isMember) {
      return { error: "no access" };
    }

    return workspaceData;
  } catch (error) {
    console.error("Fetch workspace error:", error);
    return { error: "Failed to fetch workspace" };
  }
};

export const addCommentToWorkSpace = async (
  workspaceId,
  currentUser,
  comment,
) => {
  if (!workspaceId || !currentUser || !comment.trim()) return;

  const workspaceRef = doc(db, "WorkSpaces", workspaceId);

  try {
    await updateDoc(workspaceRef, {
      comments: arrayUnion({
        createdBy: {
          id: currentUser.id,
          name: currentUser.fullName,
        },
        comment: comment.trim(),
        createdAt: Timestamp.now(),
      }),
    });
    console.log("Comment added successfully!");
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw error;
  }
};

export const getUsersMapByIds = async (userIds = []) => {
  const uniqueIds = [...new Set(userIds)];
  const usersMap = {};

  await Promise.all(
    uniqueIds.map(async (id) => {
      const snap = await getDoc(doc(db, "Users", id));
      if (snap.exists()) {
        usersMap[id] = snap.data().fullName;
      }
    }),
  );

  return usersMap;
};

export const listenWorkSpaceDetailsById = (
  workspaceId,
  currentUser,
  setWorkSpaceDetails,
  setHasAccess,
) => {
  if (!workspaceId || !currentUser) return;

  const workspaceRef = doc(db, "WorkSpaces", workspaceId);

  const unsubscribe = onSnapshot(
    workspaceRef,
    async (docSnap) => {
      if (!docSnap.exists()) {
        setHasAccess(false);
        return;
      }

      const workspaceData = docSnap.data();

      if (workspaceData.isPrivate === false) {
        setHasAccess(true);
      } else {
        const isMember =
          workspaceData.members?.includes(currentUser.id) ||
          workspaceData.createdBy === currentUser.id;

        if (!isMember) {
          setHasAccess(false);
          return;
        }
        setHasAccess(true);
      }

      const comments = workspaceData.comments || [];

      const userIds = comments.map((c) => c.createdBy?.id).filter(Boolean);

      const usersMap = await getUsersMapByIds(userIds);

      const enrichedComments = comments.map((comment) => ({
        ...comment,
        createdBy: {
          ...comment.createdBy,
          fullName: usersMap[comment.createdBy.id] || comment.createdBy.name,
        },
      }));

      setWorkSpaceDetails({
        ...workspaceData,
        comments: enrichedComments,
      });
    },
    (error) => {
      console.error("Realtime workspace fetch error:", error);
      setHasAccess(false);
    },
  );

  return unsubscribe;
};
