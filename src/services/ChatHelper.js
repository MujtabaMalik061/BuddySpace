import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
  addDoc,
  Timestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import { handleSendNotification } from "../utils/extensions/Notification.extensions";
import { getWorkSpaceDetailsById } from "./WorkSpaceSettingsHelper";

export const listenToChatMessages = (
  workspaceId,
  currentUserId,
  setMessages,
  setLoading,
) => {
  if (!workspaceId) return;

  const messagesRef = collection(db, "Chats", workspaceId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    try {
      const rawMessages = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      const userIds = [
        ...new Set(rawMessages.map((m) => m.createdBy).filter(Boolean)),
      ];

      const userMap = {};
      await Promise.all(
        userIds.map(async (uid) => {
          const userSnap = await getDoc(doc(db, "Users", uid));
          if (userSnap.exists()) {
            userMap[uid] = userSnap.data().fullName;
          }
        }),
      );
      const finalMessages = rawMessages.map((msg) => ({
        ...msg,
        user: userMap[msg.createdBy] || "Unknown",
        isOwn: msg.createdBy === currentUserId,
      }));
      setMessages(finalMessages);
    } catch (err) {
      console.error("Listen chat error:", err);
    } finally {
      setLoading(false);
    }
  });

  return unsubscribe;
};

export const sendChatMessage = async (
  workspaceId,
  userId,
  text,
  currentUser,
) => {
  if (!workspaceId || !userId || !text.trim()) return;
  const messagesRef = collection(db, "Chats", workspaceId, "messages");

  await addDoc(messagesRef, {
    message: text.trim(),
    createdBy: userId,
    createdAt: Timestamp.now(),
  });

  try {
    const workspaceData = await getWorkSpaceDetailsById(currentUser,workspaceId);
    const recipientIds =
      workspaceData.members?.filter((memberId) => memberId !== userId) || [];

    if (!recipientIds.length) return;

    handleSendNotification({
      title: "New Message",
      body: `${currentUser?.fullName} sent a message in ${workspaceData?.name}`,
      link: "/chat",
      userIds: recipientIds,
      checkType: "chat",
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
};

export const handleEditChatMessage = async (
  isEdit,
  { newMsg, editMsg, workspaceId },
) => {
  if (!isEdit || !editMsg || !newMsg.trim()) return;
  try {
    const messageRef = doc(db, "Chats", workspaceId, "messages", editMsg.id);
    await updateDoc(messageRef, {
      message: newMsg,
      isEdited: true,
    });
  } catch (err) {
    console.error("Error updating message:", err);
  }
};

export const handleDeleteChatMessage = async (msgId, workspaceId) => {
  if (!msgId || !workspaceId) return;

  try {
    const messageRef = doc(db, "Chats", workspaceId, "messages", msgId);

    await deleteDoc(messageRef);

    return true;
  } catch (err) {
    console.error("Error deleting message:", err);
    throw err;
  }
};
