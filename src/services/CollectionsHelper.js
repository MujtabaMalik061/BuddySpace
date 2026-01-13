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
  deleteDoc,
} from "firebase/firestore";
import { generateCustomId } from "../utils/Helper";
import { toast } from "sonner";

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

export const addCommentToCollection = async (
  collectionId,
  currentUser,
  comment
) => {
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

export const handleEditCollectionItem = async (itemId, data) => {
  if (!itemId) return;

  try {
    const ref = doc(db, "Collections", itemId);

    await updateDoc(ref, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Edit collection error:", error);
    throw error;
  }
};

export const handleDeleteCollectionItem = async (itemId) => {
  if (!itemId) return;

  try {
    const ref = doc(db, "Collections", itemId);
    await deleteDoc(ref);
    toast.success("Collection item deleted successfully");
    console.log("Collection deleted successfully");
  } catch (error) {
    console.error("Delete collection error:", error);
    toast.error("Failed to delete Collection item");
  }
};
