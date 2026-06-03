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
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { generateCustomId } from "../utils/Helper";
import { toast } from "sonner";
import { limit as PAGE_SIZE } from "../services/Constants";

export const addCollectionItem = async (data) => {
  const customId = await generateCustomId("Collections");

  const ref = doc(db, "Collections", customId);

  await setDoc(ref, {
    ...data,
    lowerTitle: data?.title?.toLowerCase(),
    id: customId,
    createdAt: Timestamp.now(),
  });

  return customId;
};

export const listenCollectionsByWorkspace = (
  workSpaceId,
  search,
  setItems,
  setLastDoc,
  setLastIndex,
  setLoading,
) => {
  if (!workSpaceId) return;

  setLoading(true);

  let q;

  if (search) {
    q = query(
      collection(db, "Collections"),
      where("workSpaceId", "==", workSpaceId),
      orderBy("lowerTitle"),
      where("lowerTitle", ">=", search.toLowerCase()),
      where("lowerTitle", "<=", search.toLowerCase() + "\uf8ff"),
      limit(PAGE_SIZE),
    );
  } else {
    q = query(
      collection(db, "Collections"),
      where("workSpaceId", "==", workSpaceId),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE),
    );
  }

  const unsub = onSnapshot(q, (snap) => {
    const docs = snap.docs;

    setItems(
      docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })),
    );

    setLastDoc(docs[docs.length - 1] || null);
    setLastIndex(docs.length < PAGE_SIZE);
    setLoading(false);
  });

  return unsub;
};

export const loadMoreCollections = async (
  workSpaceId,
  search,
  lastDoc,
  setItems,
  setLastDoc,
  setLastIndex,
  setLoadMoreLoading,
) => {
  if (!lastDoc) {
    setLastIndex(true);
    return;
  }

  setLoadMoreLoading(true);

  let q;

  if (search) {
    q = query(
      collection(db, "Collections"),
      where("workSpaceId", "==", workSpaceId),
      orderBy("lowerTitle"),
      where("lowerTitle", ">=", search.toLowerCase()),
      where("lowerTitle", "<=", search.toLowerCase() + "\uf8ff"),
      startAfter(lastDoc),
      limit(PAGE_SIZE),
    );
  } else {
    q = query(
      collection(db, "Collections"),
      where("workSpaceId", "==", workSpaceId),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE),
    );
  }

  const snap = await getDocs(q);
  const docs = snap.docs;

  setItems((prev) => [
    ...prev,
    ...docs.map((d) => ({ id: d.id, ...d.data() })),
  ]);

  setLastDoc(docs[docs.length - 1] || null);
  setLastIndex(docs.length < PAGE_SIZE);
  setLoadMoreLoading(false);
};

export const addCommentToCollection = async (
  collectionId,
  currentUser,
  comment,
) => {
  if (!collectionId || !currentUser || !comment.trim()) return;

  const collectionRef = doc(db, "Collections", collectionId);

  try {
    const commentId = crypto.randomUUID();
    await updateDoc(collectionRef, {
      comments: arrayUnion({
        commentId,
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

export const updateComment = async (collectionId, commentId, newComment) => {
  try {
    const collectionRef = doc(db, "Collections", collectionId);
    const collectionSnap = await getDoc(collectionRef);

    if (!collectionSnap.exists()) {
      throw new Error("Collection not found");
    }

    const data = collectionSnap.data();

    const updatedComments = (data.comments || []).map((comment) =>
      comment.commentId === commentId
        ? {
            ...comment,
            comment: newComment.trim(),
            updatedAt: new Date(),
          }
        : comment,
    );

    await updateDoc(collectionRef, {
      comments: updatedComments,
    });

    console.log("Comment updated successfully");
  } catch (error) {
    console.error("Failed to update comment:", error);
    throw error;
  }
};

export const deleteComment = async (collectionId, commentId) => {
  try {
    const collectionRef = doc(db, "Collections", collectionId);
    const collectionSnap = await getDoc(collectionRef);

    if (!collectionSnap.exists()) {
      throw new Error("Collection not found");
    }

    const data = collectionSnap.data();

    const updatedComments = (data.comments || []).filter(
      (comment) => comment.commentId !== commentId,
    );

    await updateDoc(collectionRef, {
      comments: updatedComments,
    });

    console.log("Comment deleted successfully");
  } catch (error) {
    console.error("Failed to delete comment:", error);
    throw error;
  }
};

export const handleEditCollectionItem = async (itemId, data) => {
  if (!itemId) return;

  try {
    const ref = doc(db, "Collections", itemId);

    await updateDoc(ref, {
      ...data,
      lowerTitle: data?.title?.toLowerCase(),
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
