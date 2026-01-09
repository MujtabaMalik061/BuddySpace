import { db } from "../utils/FirebaseConfig";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { generateCustomId } from "../utils/Helper";

export const addCollectionItem = async (data) => {
  const customId = await generateCustomId("Collections");

  const ref = doc(db, "Collections", customId);

  await setDoc(ref, {
    ...data,
    id: customId,
    createdAt: Timestamp.now(),
  });

  return customId;
};

export const listenCollectionsByWorkspace = (
  workSpaceId,
  setItems,
  setLoading
) => {
  if (!workSpaceId) return;
  setLoading(true);

  const q = query(
    collection(db, "Collections"),
    where("workSpaceId", "==", workSpaceId)
  );

  const unsub = onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setItems(list);
      setLoading(false);
    },
    (error) => {
      console.error("Collections listener error:", error);
      setLoading(false);
    }
  );

  return unsub;
};

export const addCommentToCollection = async (collectionId, currentUser, comment) => {
  if (!collectionId || !currentUser || !comment.trim()) return;

  const collectionRef = doc(db, "Collections", collectionId);

  try {
    await updateDoc(collectionRef, {
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