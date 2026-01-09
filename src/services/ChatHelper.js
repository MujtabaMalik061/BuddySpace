// import { db } from "../utils/FirebaseConfig";
// import {
//   doc,
//   setDoc,
//   updateDoc,
//   onSnapshot,
//   arrayUnion,
//   Timestamp,
//   getDoc,
// } from "firebase/firestore";

// export const listenToChatMessages = (workspaceId, setMessages, setLoading) => {
//   if (!workspaceId) return;

//   const chatRef = doc(db, "Chats", workspaceId);

//   const unsubscribe = onSnapshot(chatRef, (snap) => {
//     if (snap.exists()) {
//       const data = snap.data();
//       setMessages(data.messages || []);
//     } else {
//       setMessages([]);
//     }
//     setLoading(false);
//   });

//   return unsubscribe;
// };

// export const sendChatMessage = async (workspaceId, userId, message) => {
//   if (!workspaceId || !userId || !message.trim()) return;

//   const chatRef = doc(db, "Chats", workspaceId);

//   const newMessage = {
//     message: message.trim(),
//     createdAt: Timestamp.now(),
//     createdBy: userId,
//   };

//   const snap = await getDoc(chatRef);

//   if (!snap.exists()) {
//     await setDoc(chatRef, {
//       messages: [newMessage],
//     });
//   } else {
//     await updateDoc(chatRef, {
//       messages: arrayUnion(newMessage),
//     });
//   }
// };

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";

export const listenToChatMessages = (
  workspaceId,
  currentUserId,
  setMessages,
  setLoading
) => {
  if (!workspaceId) return;

  const messagesRef = collection(db, "Chats", workspaceId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    try {
      setLoading(true);

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
        })
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

export const sendChatMessage = async (workspaceId, userId, text) => {
  if (!workspaceId || !userId || !text.trim()) return;

  const messagesRef = collection(db, "Chats", workspaceId, "messages");

  await addDoc(messagesRef, {
    message: text.trim(),
    createdBy: userId,
    createdAt: Timestamp.now(),
  });
};
